import { useEffect, useState } from "react";
import Datatable from "../datatable/datatable";
import { getModelListService } from "../../services/masterservice";
import ModelAddEditComponent from "./modelAddEditComponent";
import "../datatable/master.css";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../navbar/navbar";

const Model = () => {

  const [modelList, setModelList] = useState([]);
  const [status, setStatus] = useState('');
  const [modelId, setModelId] = useState('');

  const columns = [
    { name: "SN", selector: (row) => row.sn, sortable: true, align: 'text-center' },
    { name: "Model Name", selector: (row) => row.name, sortable: true, align: 'text-center' },
    { name: "Action", selector: (row) => row.action, sortable: true, align: 'text-center', },
  ];

  const editModel = async (id) => {
    setModelId(id);
    setStatus('edit');
  }

  const addModel = () => {
    setStatus('add');
  }

  const getModelMasterList = async () => {
    try {
      const data = await getModelListService();
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
    getModelMasterList();
  }, []);

  const setTableData = (data) => {
    setModelList(
      data.map((item, index) => ({
        sn: index + 1 + '.',
        name: item.name ?? '-',
        action: (
              <button className="btn btn-warning btn-sm me-1" onClick={() => item.id != null && editModel(item.id)} title="Edit Model">
                <FaUserEdit size={16} />
              </button>
        ),
      }))
    );
  };

  switch (status) {
    case 'add':
      return <ModelAddEditComponent mode={'add'}></ModelAddEditComponent>;
    case 'edit':
      return <ModelAddEditComponent mode={'edit'} modelId={modelId}></ModelAddEditComponent>;
    default:
      return (
        <div>
          <Navbar />
          <div className="card p-2">
            <div className="card-body text-center">
              <h3>Model List</h3>
              <div id="card-body customized-card">
                {<Datatable columns={columns} data={modelList} />}
              </div>
              <div align="center" >
                <button className="mt-2 btn add" onClick={() => addModel()} >
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

export default Model;