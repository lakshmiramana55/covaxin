import React, { useEffect, useState ,useReducer} from "react";

// import axios from  'axios'
import './App.css';

function App() {
  const [users, fetchUsers] = useState([])
  const [vaccineResultsArr, setVaccineResultsArr]=useState([])
  

//converting current dateObj to input format yyyy-mm-dd
  const currentDateToInputFormat = () => {
    const selectedDateObj = new Date();
    const selectedDate = selectedDateObj.getDate();
    const selectedMonth = selectedDateObj.getMonth() + 1;
    const selectedYear = selectedDateObj.getFullYear();
    const inputFormatDate = `${selectedYear}-${
      selectedMonth <= 9 ? `0${selectedMonth}` : selectedMonth
    }-${selectedDate}`;
    return inputFormatDate;
  };

  //using state to store input date in input format yyyy-mm-dd
  const [selectedInputDate, setSelectedInputDate] = useState(
    currentDateToInputFormat()
  );

  
  const changeDateHandler = (event) => {
    //input date format is yyyy-mm-dd, req format to fetch data is dd-mm-yyyy
    setSelectedInputDate(event.target.value);
  };


  const convertInputDateFormatToReqFormat = (inputDateFormat) => {
    const selectedDateObj = new Date(inputDateFormat);
    const selecetedDate = selectedDateObj.getDate();
    const selectedMonth = selectedDateObj.getMonth() + 1;
    const selectedYear = selectedDateObj.getFullYear();
    const reqDateFormat = `${selecetedDate}-${
      selectedMonth <= 9 ? `0${selectedMonth}` : selectedMonth
    }-${selectedYear}`;
    return reqDateFormat
    
  };

  const getData = async() => {
    const reqDateFormat = convertInputDateFormatToReqFormat(
      selectedInputDate
    );
    console.log(reqDateFormat);
    const fetchCovaxinDetailsUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict`;
      const fetchedCovaxinResults = await fetch(
        `${fetchCovaxinDetailsUrl}?district_id=363&date=${reqDateFormat}`)
        console.log(`${fetchCovaxinDetailsUrl}?district_id=363&date=${reqDateFormat}`)

        const fetchedCovaxinResultsJson = await fetchedCovaxinResults.json();
        console.log(fetchedCovaxinResultsJson.centers.length)

        //filtering result array based on date in sessions in response obj
        const filteredResultArr=fetchedCovaxinResultsJson.centers.filter(
          (eachItem)=>{
            return (eachItem.sessions[0].date===reqDateFormat)
          }
        )
        setVaccineResultsArr(filteredResultArr)
        console.log(filteredResultArr.length)
  }



  const submitHandler=()=>{
    getData()
  }
    

  return (
    <>
    <div className="covaxin-container">
      <input type = "date" className="input-container"
      value={selectedInputDate}
      onChange={changeDateHandler}
      />
      <button type="button" className='go-button'
      onClick={submitHandler}
      >Submit</button>
     </div>
      <div className="header">
        <table>
      <thead>
           <tr>
           <th className="table-head">No</th>
             <th className="table-head">Name</th>
             <th className="table-head">Vaccine</th>
             <th className="table-head">Available Capacity</th>
             <th className="table-head">Slots</th>
            
           </tr>
       </thead>
       <tbody>
                {vaccineResultsArr.map((eachVaccineCenter,index) =>{
                return (    
              <tr key={eachVaccineCenter.center_id}>
             
                <td>{eachVaccineCenter.center_id}</td>
                <td>{eachVaccineCenter.name}</td>
                <td>{eachVaccineCenter.sessions[0].vaccine}</td>
                <td>{eachVaccineCenter.sessions[0].available_capacity}</td>
                <td>{eachVaccineCenter.sessions[0].slots.map(
                  (eachTImeSlot)=>{
                    return (<div>
                      <p>{eachTImeSlot.time}</p>
                    </div>)
                  }
                )}</td>
                {/* <th >{item.mas_firstName}</th>
                <th >{item.mas_lastName}</th>
                <th >{item.mas_schoolName}</th>
                <th >{item.mas_createdOn}</th>
                <th >{item.mas_kidStatus}</th> */}
              </tr>
                );
               })}
            </tbody>
          </table>
       </div>
      </>
  );
}

export default App;
