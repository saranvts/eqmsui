
import { useEffect, useState } from "react";
import Datatable from "../datatable/datatable";
import {getEquipmentLogListService}  from "../../services/masterservice";
import EquipmentLogAddEditComponent from "./equipmentLogAddEditComponent";
import "../datatable/master.css";
import { FaUserEdit } from "react-icons/fa";
 import { Link } from "react-router-dom";
import Navbar from "../navbar/navbar";
import formatDate from "../../common/dateFormatter";

const EquipmentLog= () =>{

  const [equipmentLogList, setEquipmentLogList] = useState([]);
  const [status, setStatus] = useState('');
  const [equpmentLogId, setEqupmentLogId] = useState('');

const columns = [
  { name: "SN", selector: (row) => row.sn, sortable: true, align: 'text-center' },
  { name: "Calibration Agency", selector: (row) => row.equipment, sortable: true, align: 'text-start' },
  { name: "Start Time", selector: (row) => row.startTime, sortable: true, align: 'text-center' },
  { name: "End Time", selector: (row) => row.endTime, sortable: true, align: 'text-center' },
  { name: "Total Hours", selector: (row) => row.totalHours, sortable: true, align: 'text-end' },
  { name: "Usage Date", selector: (row) => row.usageDate, sortable: true, align: 'text-center', },
  { name: "Action", selector: (row) => row.action, sortable: true, align: 'text-center', },
];

const editEquipmentLog = async (id) =>{
  setEqupmentLogId(id);
  setStatus('edit');
}

const addEquipmentLog = () =>{
  setStatus('add');
}

      const getEquipmentLogMasterList = async () => {
        try {
          const data = await getEquipmentLogListService();
          if (Array.isArray(data) && data.length > 0) {
            setTableData(data);
          } else {
            setTableData([]);
          }
        } catch (err) {
          setTableData([]);
        }
      };
      
      useEffect(() => {
        getEquipmentLogMasterList();
      }, []);
      
      const setTableData = (data) => {
        setEquipmentLogList(
          data.map((item, index) => ({
            sn: index + 1 + '.',
            equipment: item.equipment?.calibrationAgency?.trim() ? item.equipment.calibrationAgency : '-',
            startTime: item.startTime ? formatDate(item.startTime) : '-',
            endTime: item.endTime ? formatDate(item.endTime) : '-',
            totalHours: item.totalHours != null ? `${item.totalHours}` : '-',
            usageDate: item.usageDate ? formatDate(item.usageDate, false) : '-',
            action: (
                <button className="btn btn-warning btn-sm me-1" onClick={() => item.id != null && editEquipmentLog(item.id)} title="Edit Equipment Log">
                  <FaUserEdit  size={16}/>
                </button>
            ),
          }))
        );
      };

  switch (status) {
    case 'add':
      return <EquipmentLogAddEditComponent mode={'add'}></EquipmentLogAddEditComponent>;
    case 'edit':
      return <EquipmentLogAddEditComponent mode={'edit'} equpmentLogId = {equpmentLogId}></EquipmentLogAddEditComponent>;
    default:
    return (
      <div>
        <Navbar />
        <div className="card p-2">
          <div className="card-body text-center">
            <h3>Equipment Usage Log List</h3>
            <div id="card-body customized-card">
              {<Datatable columns={columns} data={equipmentLogList} />}
            </div>
            <div align="center" >
              <button className="mt-2 btn add" onClick={() => addEquipmentLog()} >
                ADD
              </button>
              <Link className="mt-2 btn back" to="/dashboard">BACK</Link>
            </div>
          </div>
        </div>
      </div>
      
    );
  };
}

export default EquipmentLog;