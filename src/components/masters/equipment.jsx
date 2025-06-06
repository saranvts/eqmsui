import { useEffect, useState } from "react";
import Datatable from "../datatable/datatable";
import { getEquipmentListService } from "../../services/masterservice";
import EquipmentAddEditComponent from "./equipmentAddEditComponent";
import "../datatable/master.css";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../navbar/navbar";

const Equipment = () => { 

  const [equipmentList, setEquipmentList] = useState([]);
  const [status, setStatus] = useState('');
  const [equipmentId, setEquipmentId] = useState('');

  const columns = [
    { name: "SN", selector: (row) => row.sn, sortable: true, align: 'text-center' },
    { name: "Calibration Agency", selector: (row) => row.calibrationAgency, sortable: true, align: 'text-start' },
    { name: "Procured By", selector: (row) => row.procuredBy, sortable: true, align: 'text-start' },
    { name: "Item Cost", selector: (row) => row.itemCost, sortable: true, align: 'text-end' },
    { name: "Location", selector: (row) => row.location, sortable: true, align: 'text-center', },
    { name: "Action", selector: (row) => row.action, sortable: true, align: 'text-center', },
  ];

  const editEquipment = async (id) => {
    setEquipmentId(id);
    setStatus('edit');
  }

  const addEquipment = () => {
    setStatus('add');
  }

  const getEquipmentMasterList = async () => {
    try {
      const data = await getEquipmentListService();
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
    getEquipmentMasterList();
  }, []);

  const setTableData = (data) => {
    setEquipmentList(
      data.map((item, index) => ({
        sn: index + 1 + '.',
        calibrationAgency: item.calibrationAgency ?? '-',
        itemCost: item.itemCost ?? '-',
        procuredBy: item.procuredBy ?? '-',
        location: item.location ?? '-',
        action: (
              <button className="btn btn-warning btn-sm me-1" onClick={() => item.id != null && editEquipment(item.id)} title="Edit Equipment">
                <FaUserEdit size={16} />
              </button>    
        ),
      }))
    );
  };

  switch (status) {
    case 'add':
      return <EquipmentAddEditComponent mode={'add'}></EquipmentAddEditComponent>;
    case 'edit':
      return <EquipmentAddEditComponent mode={'edit'} equipmentId={equipmentId}></EquipmentAddEditComponent>;
    default:
      return (
        <div>
          <Navbar />
          <div className="card p-2">
            <div className="card-body text-center">
              <h3>Equipment List</h3>
              <div id="card-body customized-card">
                {<Datatable columns={columns} data={equipmentList} />}
              </div>
              <div align="center" >
                <button className="mt-2 btn add" onClick={() => addEquipment()} >
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

export default Equipment;