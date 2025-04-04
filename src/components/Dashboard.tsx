import { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() 
{
  useEffect(() => {
    let _ud: any = localStorage.getItem('user_data');
    if (_ud) 
    {
      let ud = JSON.parse(_ud);
      setUserId(ud.id);
      console.log('Extracted userId:', ud.id);

      fetch(`https://yourucf.com/api/plans/user/${ud.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.semesters) 
        {
          setSemesters(data.semesters);
        } else
        {
          setMessage('No semesters found');
        }
      })
      .catch((error) => {
	console.error('Error fetching semesters:', error)
        setMessage(`Error fetching semesters: ${error.message}`);
      });
    }
  }, []);

  const [userId, setUserId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [semesterName, setSemesterName] = useState('');
  const [year, setYear] = useState('');
  const [semesters, setSemesters] = useState<{ _id: string; semester: string; year: string }[]>([]); 
  const [showAddSemesterForm, setShowAddSemesterForm] = useState(false);
  const[searchValue, setSearchValue] = useState('');
  const[searchMode, setSearchMode] = useState(2);

  const addSemesterTile = () => 
    {
    setShowAddSemesterForm(true); 
  };

  async function addSemester(e: any): Promise<void> 
  {
    e.preventDefault();

    let obj = { userId: userId, semesterName: semesterName, year: Number(year) };
    let js = JSON.stringify(obj);

    try 
    {
      const response = await fetch('https://yourucf.com/api/plans/addSemester',
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' 

        }});

      if(!response.ok)//couldnt do addsemester
      {
        console.log("Couldnt addSemester, checking the error.");
        let errText = await response.text();
        let errJson;
        try 
        {
          errJson = JSON.parse(errText);
          console.log("Error from API:", errJson.error);
          
          if(errJson.error === "Plan of Study not found.")
          {
            console.log("Plan of study not found, making one..");
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
                console.log("Error creating Plan of study");
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
    console.log('Add Semester Response:', res);
    setSemesters((prevSemesters) => [...prevSemesters, { _id: res._id, semester: semesterName, year: year }]);
    setMessage(`${semesterName} has been added!`);
    setShowAddSemesterForm(false);
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
    console.log("Sending request:", obj);
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
       
        console.log("Search Resuluts: ", data.semesters);
        if(!data.semesters)
        {
          setMessage("No semesters found");
        }

        const formattedSemesters = data.semesters.map((semester: any) => ({
          _id: semester._id,
          semester: semester.semester,
          year: semester.year,
        }));
    
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
 


  return (
    <div className="dashboard-container">
      <h1>Welcome to your Dashboard!</h1>

      <button onClick={addSemesterTile} className="Add-Semester-Button">Add Semester </button>

      <input type="text"placeholder="Search semesters.."value={searchValue}onChange={handleSetSearchValue}className="search-input" />
      <select value={searchMode} onChange={handleSetSearchMode}className="search-dropdown" >
        <option value={0}>Search by Name</option>
        <option value={1}>Search by Year</option>
        <option value={2}>Search by Name & Year</option>
      </select>

      <button onClick={() => searchSemester(searchValue, searchMode)} className="search-button">Search</button>

      {message && <p className="message-box">{message}</p>}  
      {showAddSemesterForm && (
        <div className="semester-tiles">
          <input type="text"placeholder="Semester Name" value={semesterName}onChange={handleSetSemesterName}required/>
          <input type="text"placeholder="Year" value={year}onChange={handleSetYear}required/>
          <button onClick={addSemester}>Done</button>
        </div>
      )}

      <div className="semester-container">
        {semesters.map((semester) => (
            <div key={semester._id} className="semester-tile">
            <div className="tile-labels">
              {semester.semester} {semester.year}
              <button className="delete-button" onClick={() => deleteSemester(semester._id, userId)}>Delete</button>  
            </div>
            <div className="drag-drop-area"></div>
      </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

