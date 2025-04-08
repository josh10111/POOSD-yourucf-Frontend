import { useEffect, useState } from 'react';
import './Dashboard.css';
import ucfLogo from '../assets/ucf-logo.png';

function Dashboard() 
{
  const [userId, setUserId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [semesterName, setSemesterName] = useState('');
  const [year, setYear] = useState('');
  const [semesters, setSemesters] = useState<{ _id: string; semester: string; year: string; courses: any[] }[]>([]);
  const [showAddSemesterForm, setShowAddSemesterForm] = useState(false);
  const[searchValue, setSearchValue] = useState('');
  const[searchMode, setSearchMode] = useState(2);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const[takenClasses, setTakenClass] = useState<string[]>([]);
  const[searchCourse, setSearchCourse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let _ud: any = localStorage.getItem('user_data');
      if (_ud) {
        let ud = JSON.parse(_ud);
        setUserId(ud.id);
        console.log('Extracted userId:', ud.id);
  
        try {
          const [plansResponse, availableResponse] = await Promise.all([
            fetch(`https://yourucf.com/api/plans/user/${ud.id}`),
            fetch(`https://yourucf.com/api/plans/available/${ud.id}`), 
          ]);
  
          if (!plansResponse.ok) {
            throw new Error(`Failed to fetch plans: ${plansResponse.status}`);
          }
          if (!availableResponse.ok) {
            throw new Error(`Failed to fetch available courses: ${availableResponse.status}`);
          }
  
          const plansData = await plansResponse.json();
          const availableData = await availableResponse.json();
          setAvailableClasses(availableData);
          const takenCourses: string[] = [];
  
          if (plansData.semesters) 
          {
            
  
            const semestersWithCourses = await Promise.all(
              plansData.semesters.map(async (semester: any) => ({
                ...semester,
                courses: await Promise.all(
                  semester.courses.map(async (course: any) => {
                    const courseId = typeof course.courseId === 'object' ? course.courseId._id : course.courseId;
                    takenCourses.push(courseId);
                    const courseName = await fetchCourseName(courseId);
                    const creditHours = await fetchCreditHours(courseId);
                    const semestersProvided = await fetchSemestersProvided(courseId);
                    const courseCode = await fetchCourseCode(courseId);
                    return {
                      courseId,
                      courseName,
                      status: course.status,
                      _id: course._id,
                      creditHours: creditHours,
                      semestersProvided: semestersProvided,
                      courseCode: courseCode
                    };
                  })
                ),
              }))
            );
  
            setSemesters(semestersWithCourses);
            setTakenClass(takenCourses);
          } else {
            setMessage('No semesters found');
          }
        } catch (error: any) {
          setMessage(`Error: ${error.message}`);
        }
      }
    };
  
    fetchData();
  }, []);
  
 
  async function addSemester(e: any): Promise<void> 
  {
    e.preventDefault();

    let obj = { userId: userId, semesterName: semesterName.trim(), year: Number(year) };
    let js = JSON.stringify(obj);
    try 
    {
      const response = await fetch('https://yourucf.com/api/plans/addSemester',
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' 

        }});

      if(!response.ok)
      {
        let errText = await response.text();
        let errJson;
        try 
        {
          errJson = JSON.parse(errText);
          
          if(errJson.error === "Plan of Study not found.")
          {
            let createObj = {studentId: userId, semesters: [], totalCredits: -1};
            let createJs = JSON.stringify(createObj);
          
            const createResponse = await fetch('https://yourucf.com/api/plans/create',
              { method: 'POST', body: createJs,headers: {'Content-Type' : 'application/json'
        
              }});

              if(createResponse.ok)
              {
                console.log("Plan of study made, Going to retry to add");
                return addSemester({ preventDefault: () => {} });
              }
              else
              {
                let createerr = await createResponse.text();
                console.log("Create API Response:", createerr);
                setMessage("Error: Failed to make POS");
                return;
              }
          }
          else
          {
            setMessage("API Error: " + errJson.error);
            return;
          }
            
        }
        catch
        {
          setMessage("Unexpected API error.");
          return;
        }

      }
      
      let res = await response.json();
      setSemesters((prevSemesters) => [...prevSemesters, { _id: res._id, semester: semesterName, year: year, courses: res.courses ?? [] }]);
      setMessage(`${semesterName} has been added!`);
      window.location.reload();
      setShowAddSemesterForm(false);
      }
      catch (error: any) 
      {
        setMessage(error.toString());
      }
    }


const addCourse = async (semesterId: string, userId: string, courseId: string): Promise<any> => {
    try 
    {

      let obj = {courseId: courseId};
      let js = JSON.stringify(obj);

      const response = await fetch(`https://yourucf.com/api/plans/${userId}/semesters/${semesterId}/courses`,
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' }
  
        });

        if(!response.ok) 
          {
            let errText = await response.text();
            let errJson = JSON.parse(errText);
            setMessage(`Error: ${errJson.error}`);
            return;
          }
          const res = await response.json();
          setMessage('Course added successfully!!');
          return res.semester; 
     
    }
    catch (error: any) 
    {
      setMessage(error.toString());
    }
  }

  const deleteCourse = async (semesterId: string, userId: string, courseId: string): Promise<any> => {
    try 
    {
     
      const response = await fetch(`https://yourucf.com/api/plans/${userId}/semesters/${semesterId}/courses/${courseId}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' }
        });

        if(!response.ok) 
          {
            let errText = await response.text();
            let errJson = JSON.parse(errText);
            setMessage(`Error: ${errJson.error}`);
            return;
          }
          
          const res = await response.json();
          setMessage('Course removed successfully!!');

          setAvailableClasses((prevAvailableClasses) =>
            prevAvailableClasses.filter((availableCourse) => availableCourse._id !== courseId)
          );
          
          setSemesters(prevSemesters =>
            prevSemesters.map(semester => {
              if (semester._id === semesterId) 
              {
                const filteredCourses = semester.courses.filter(course => {
                  return course.courseId !== courseId;
                });

          
                return {
                  ...semester,
                  courses: filteredCourses
                  
                };
              }
              return semester;
            })
          );
          return res.semester;
          
    }
    catch (error: any) 
    {
      setMessage(error.toString());
    }
  }

async function deleteSemester(semesterId:string, userId:string): Promise<void> 
  {
    try 
    {
      if (!semesterId) {
        setMessage("Error: Invalid semester ID.");
        return;
      }
      const response = await fetch(`https://yourucf.com/api/plans/deleteSemester/${semesterId}/user/${userId}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' 

        }});

      if(!response.ok) 
      {
        let errText = await response.text();
        let errJson = JSON.parse(errText);
        setMessage(`Error: ${errJson.error}`);
        return;
      }
      setSemesters((prevSemesters) =>
        prevSemesters.filter((semester) => String(semester._id) !== semesterId)
    );
       
    }

    catch (error: any) 
    {
      setMessage(error.toString());
    }
  }

 
async function searchSemester(searchValue:string, searchMode: number) : Promise<void>
{
    
    
    let obj = {userId:userId,search:searchValue, mode:searchMode};
    let js = JSON.stringify(obj);
    try
    {
        const response = await fetch('https://yourucf.com/api/plans/searchSemester',
        {method:'POST',body:js,headers:{'Content-Type':'application/json'},
        });

        if(!response.ok)
        {
          let txt = await response.text();
          setMessage(`Error: ${txt}`);
          return;
        }
       
        let data = await response.json();
        if(!data.semesters)
        {
          setMessage("No semesters found");
        }
        const formattedSemesters = await Promise.all(
          data.semesters.map(async (semester: any) => ({
            _id: semester._id,
            semester: semester.semester,
            year: semester.year,
            courses: semester.courses
              ? await Promise.all(
                  semester.courses.map(async (course: any) => {
                    const courseId = typeof course.courseId === 'object' ? course.courseId._id : course.courseId;
                    const courseName = await fetchCourseName(courseId);
                    const creditHours = await fetchCreditHours(courseId);
                    const courseCode = await fetchCourseCode(courseId);
                    return {
                      courseId,
                      courseName,
                      status: course.status,
                      _id: course._id,
                      creditHours: creditHours,
                      courseCode: courseCode
                    };
                  })
                )
              : [],
          }))
        );
      
        setSemesters(formattedSemesters);
      

    } 
    catch (error: any) 
    {
        setMessage(error.toString());
    }
};

  function handleSetSemesterName(e: any): void 
  {
    setSemesterName(e.target.value);
  }
  function handleSetYear(e: any): void 
  {
    setYear(e.target.value);
  }
  function handleSetSearchValue(e: any): void 
  {
    setSearchValue(e.target.value);
  }
  function handleSetSearchMode(e: any): void 
  {
    setSearchMode(Number(e.target.value));
  }

  function handleSetSearchCourse(e:any): void
  {
    setSearchCourse(e.target.value);
  }
  function creditTotal(courses: any[]) : number
  {
    if(!courses || courses.length === 0)
    {
      return 0;
    }
    
    return courses.reduce((sum, course) => sum + course.creditHours, 0);

   

  }
  const filteredAvailableClasses = availableClasses.filter(course =>
    course.name.toLowerCase().includes(searchCourse.toLowerCase()) || course.courseCode.toLowerCase().includes(searchCourse.toLowerCase())
  );
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, course: any) => 
  {
    event.dataTransfer.setData('text/plain', JSON.stringify(course));
  };
 
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => 
  {
    event.preventDefault();
  }
  const addSemesterTile = () => 
    {
    setShowAddSemesterForm(true); 
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>, semesterId: string) => {
    event.preventDefault();
    const courseData = event.dataTransfer.getData('text/plain');
    const course = JSON.parse(courseData);
    const prerequisites: string[] = await fetchprereq(course._id); 
    const notTaken = prerequisites.filter((prereq: string) => !takenClasses.includes(prereq));
  
    if(notTaken.length > 0)
    {
      const missingNames = await Promise.all(notTaken.map((prereqId) => fetchCourseName(prereqId)));
      setMessage(`Prerequisite not met: ${missingNames.join(', ')}`);
      return; 
    }
    
    const updatedSemester = await addCourse(semesterId, userId, course._id);
    setTakenClass((prev) => [...prev, course._id]);

    if (updatedSemester && updatedSemester.courses) 
    {

      const coursesWithNames = await Promise.all(
        updatedSemester.courses.map(async (course: any) => ({
          ...course,
          courseName: await fetchCourseName(course.courseId),
          creditHours: await fetchCreditHours(course.courseId),
          semestersProvided: await fetchSemestersProvided(course.courseId),
          courseCode: await fetchCourseCode(course.courseId)
        }))
      );
      
      setSemesters((prevSemesters) =>
        prevSemesters.map((semester) =>
          semester._id === updatedSemester._id
            ? { ...semester, courses: coursesWithNames }
            : semester
        )
      );
    }
    setAvailableClasses((prevAvailableClasses => 
      prevAvailableClasses.filter((availableCourse) => availableCourse._id !== course._id))
    );
  
  };           
      

  const fetchCourseName = async(courseId: string) =>
  {
    try
    {
      const response = await fetch(`https://yourucf.com/api/courses/${courseId}`);

      if(!response.ok)
        throw new Error('Failed to fetch course name');
      
      const data = await response.json();
      
      return data.courseName;
    }
    catch (error: any) 
    {
      setMessage(error.toString());
      return `Course ID: ${courseId}`;
    }

  };
  const fetchSemestersProvided = async(courseId: string) =>
    {
      try
      {
  
        const response = await fetch(`https://yourucf.com/api/courses/${courseId}`);
  
        if(!response.ok)
          throw new Error('Failed to fetch course name');
        
        const data = await response.json();
        
        return data.semestersOffered;
      }
      catch (error: any) 
      {
        setMessage(error.toString());
        return `Course ID: ${courseId}`;
      }
  
    };

  const fetchprereq = async(courseId: string) =>
    {
      try
      {
  
        const response = await fetch(`https://yourucf.com/api/courses/${courseId}`);
  
        if(!response.ok)
          throw new Error('Failed to fetch course name');
        
        const data = await response.json();
        
        return data.prerequisites;
      }
      catch (error: any) 
      {
        setMessage(error.toString());
        return [];

      }
  
    };

  const fetchCourseCode = async(courseId: string) =>
    {
      try
      {

        const response = await fetch(`https://yourucf.com/api/courses/${courseId}`);

        if(!response.ok)
          throw new Error('Failed to fetch course name');

        const data = await response.json();

        return data.courseCode;
      }
      catch (error: any) 
      {
      setMessage(error.toString());
        return `Course ID: ${courseId}`;
      }

    };
  
  const fetchCreditHours = async(courseId: string) =>
      {
        try
        {
    
          const response = await fetch(`https://yourucf.com/api/courses/${courseId}`);
    
          if(!response.ok)
            throw new Error('Failed to fetch course name');
          
          const data = await response.json();
          
          return data.creditHours;
        }
        catch (error: any) 
        {
          setMessage(error.toString());
          return `Course ID: ${courseId}`;
        }
    
      }; 
      
 const doLogout = () =>
  {
    
    localStorage.removeItem("user_data")
    window.location.href = '/';
  };


  return (
    <div className='application'>
      <div className='navbar'>
        <img src={ucfLogo} alt='ucf constellation logo' className='logo'/>
        <ul>
          <li><a href="https://www.cs.ucf.edu/wp-content/uploads/2024/09/CSIT-Elective-List-AY2024-2025.pdf" target="_blank" rel="noopener noreferrer">Electives List</a></li>
          <li><a href="https://www.cs.ucf.edu/wp-content/uploads/2024/04/CS-2024-2025-Course-Flowchart.pdf" target="_blank" rel="noopener noreferrer">CS Flowchart</a></li>
          <li><a href="https://my.ucf.edu/" target="_blank" rel="noopener noreferrer">myUCF</a></li>
          <li><a href="https://webcourses.ucf.edu/" target="_blank" rel="noopener noreferrer">webcourses</a></li>
          <li><a href="https://www.ucf.edu/" target="_blank" rel="noopener noreferrer">UCF</a></li>
          <li onClick={doLogout}>Logout</li>
        </ul>
      </div>

      <div className='main-content'>
        <div className='dashboard-container'>
          <div className='title-container'>
            <div className='title'>
              <h1>Dashboard</h1>
            </div>
          </div>

          <div className='interactive'>

            <div className='search-field'>

              <div className='add-semester-container'>
                <button onClick={addSemesterTile} className="Add-Semester-Button">Add Semester </button>
              </div>

              <div className='search-container'>
                <div className='inputBox1'>
                  <input type="text"placeholder="Search semesters..."value={searchValue}onChange={handleSetSearchValue}className="search-input" />
                </div>

                <div className='inputBox1'>
                  <select value={searchMode} onChange={handleSetSearchMode}className="search-dropdown" >
                    <option value={0}>Name</option>
                    <option value={1}>Year</option>
                    <option value={2}>Name & Year</option>
                  </select>
                </div>
                

                <button onClick={() => searchSemester(searchValue, searchMode)} className="search-button">Search</button>
              </div>

            </div>
            {showAddSemesterForm && (
              <div className="semester-tiles">
                <div className='search-container'>
                  <div className='inputBox1'> 
                    <input type="text"placeholder="Semester Name" value={semesterName}onChange={handleSetSemesterName}required/>
                  </div>
                  <div className='inputBox1'> 
                    <input type="text"placeholder="Year" value={year}onChange={handleSetYear}required/>
                  </div>
                
                  <button onClick={addSemester} className='semester-add-button'>Done</button>
                </div>
              </div>
            )}
            <div className='message-container'>
              <div className='message-container-child'>
                {message && <p className="message-box">{message}</p>}  
              </div>
              
            </div>
            <div className="semester-container">
              {semesters.map((semester) => (
                  <div key={semester._id} className="semester-tile" onDragOver={handleDragOver} onDrop={(event) => handleDrop(event, semester._id)} >
                    <div className="tile-labels">
                      {semester.semester} {semester.year}
                      <p>Total Credit Hours: {creditTotal(semester.courses)}</p>
                      <button className="delete-button" onClick={() => deleteSemester(semester._id, userId)}><i className='bx bxs-trash-alt'></i></button>  
                    </div>
                    <div className="drag-drop-area">
                      {semester.courses && semester.courses.length > 0 ? (
                      semester.courses.map((course) => (
                        <div key={course._id} className="course-in-semester">
                          <div className="crn">{course.courseCode}</div>
                          <div className="course-name"><span style={{ marginRight: '10px' }}>{course.courseName}</span> </div>
                          <div className="credits"><span>{course.creditHours} Cr</span></div>
                          <div className="delete-course-btn-container"><button className="delete-course-btn"onClick={() => deleteCourse(semester._id, userId, course.courseId)}><i className='bx bxs-trash-alt'></i></button></div>
                          
                        </div>
                          ))
                        ) : (
                          <p>No courses added yet.</p>
                        )}                
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="available-courses-container">
          <div className="available-title">
            <span>Available Courses</span>
          </div>
          <div className='available-search-container'>
            <input type="text"placeholder="Search Courses..." value={searchCourse}onChange={handleSetSearchCourse}className="search-bar"/>
          </div>
          <div className='results'>
            {filteredAvailableClasses.length > 0 ? (
                filteredAvailableClasses.map((course) => (
                  <div key={course._id} className="available-course-item" draggable onDragStart={(event) => handleDragStart(event, course)}>
                    <span style={{ marginRight: '10px' }}>{course.courseCode}</span> 
                    <span>{course.name}</span>
                  </div>
                ))
              ) : (
                <p>No available courses</p>
              )}
          </div>
              
          </div>
      </div>
    </div>
    
  );
}
export default Dashboard;