import React, {useState} from "react";
import { Modal, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';




function App() {
 
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

        
        const filteredResultArr=fetchedCovaxinResultsJson.centers.filter(
          (eachItem)=>{
            return (eachItem.sessions[0].date===reqDateFormat)
          }
        )
        setVaccineResultsArr(filteredResultArr)
        console.log(filteredResultArr.length)
        if(filteredResultArr.length===0){
          handleShow()
        }
  }



  const submitHandler=()=>{
    getData()
    
  }
    

  const [popupShow, setPopupShow] = useState(false);

  const handleClose = () => setPopupShow(false);
  const handleShow = () => setPopupShow(true);


  


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
     
     <div>
     <Modal show={popupShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>No data available for this date!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
         
        </Modal.Footer>
      </Modal>
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
                {
              
                (vaccineResultsArr.map((eachVaccineCenter,index) =>{
                return (    
              <tr className="table-body-item" key={eachVaccineCenter.center_id}>
             
                <td className="table-body-item">{eachVaccineCenter.center_id}</td>
                <td className="table-body-item">{eachVaccineCenter.name}</td>
                <td className="table-body-item">{eachVaccineCenter.sessions[0].vaccine}</td>
                <td className="table-body-item">{eachVaccineCenter.sessions[0].available_capacity}</td>
                <td className="table-body-item">{eachVaccineCenter.sessions[0].slots.map(
                  (eachTImeSlot)=>{
                    return (<div>
                      <p>{eachTImeSlot.time}</p>
                    </div>)
                  }
                )}</td>
                
              </tr>
                );
               }))}
            </tbody>
          </table>
       </div>
      </>
  );
}

export default App;
