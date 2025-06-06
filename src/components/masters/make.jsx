import { useEffect, useState } from "react";
import Datatable from "../datatable/datatable";
import {getMakeListService}  from "../../services/masterservice";
import MakeAddEditComponent from "./makeAddEditComponent";
import "../datatable/master.css";
import { FaUserEdit } from "react-icons/fa";
 import { Link } from "react-router-dom";
import Navbar from "../navbar/navbar";

const Make= () =>{

  const [makeList, setMakeList] = useState([]);
  const [status, setStatus] = useState('');
  const [makeId, setMakeId] = useState('');

const columns = [
  { name: "SN", selector: (row) => row.sn, sortable: true, align: 'text-center', width: '50px' },
  { name: "Make Name", selector: (row) => row.name, sortable: true, align: 'text-start', width: '50px' },
  { name: "Action", selector: (row) => row.action, sortable: true, align: 'text-center', width: '50px' },
];

    const editMake= async (id) => {
      setMakeId(id);
        setStatus('edit');
    }

    const addMake = () => {
        setStatus('add');
    }

    const getMakeMasterList = async () => {
        try {
          const data = await getMakeListService(); 
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
        getMakeMasterList();
      }, []);
      
      const setTableData = (data) => {
        setMakeList(
          data.map((item, index) => ({
            sn: index + 1 + '.',
            name: item.name ?? '-',
            action: (
                <button className="btn btn-warning btn-sm me-1" onClick={() => item.id != null && editMake(item.id)} title="Edit Make">
                  <FaUserEdit  size={16}/>
                </button>
            ),
          }))
        );
      };

  switch (status) {
    case 'add':
      return <MakeAddEditComponent mode={'add'}></MakeAddEditComponent>;
    case 'edit':
      return <MakeAddEditComponent mode={'edit'} makeId= {makeId}></MakeAddEditComponent>;
    default:
    return (
      <div>
        <Navbar />
        <div className="card p-2">
          <div className="card-body text-center">
            <h3>Make List</h3>
            <div id="card-body customized-card">
              {<Datatable columns={columns} data={makeList} />}
            </div>
            <div align="center" >
              <button className="mt-2 btn add" onClick={() => addMake()} >
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

export default Make;