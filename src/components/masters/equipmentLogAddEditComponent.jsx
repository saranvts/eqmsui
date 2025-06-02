import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, } from "formik";
import * as Yup from "yup";
import "../datatable/master.css";
import { saveEquipmentLogData, partialUpdateEquipmentLog, getEquipmentLogById, getEquipmentListService } from "../../services/masterservice";
import { showAlert, showConfirmation } from "../datatable/swalHelper";
import EquipmentLog from "./equipmentLog";
import Navbar from "../navbar/navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormikSelect from "../../common/formikSelect";


const EquipmentLogAddEditComponent = ({ mode, equpmentLogId }) => {

  const [status, setStatus] = useState('');
  const [equipmentList, setEquipmentList] = useState([]);

  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    totalHours: "",
    usageDate: "",
    equipment: "",
    description: ""

  });



  const getDataById = async (equpmentLogId) => {
    try {
      const data = await getEquipmentLogById(equpmentLogId);
      if (!data) return;

      setFormData(prev => ({
        ...prev,
        id: data?.id ?? "",
        startTime: data.startTime ? new Date(data.startTime) : "",
        endTime: data.endTime ? new Date(data.endTime) : "",
        usageDate: data.usageDate ? new Date(data.usageDate) : "",
        totalHours: data?.totalHours ?? "",
        equipment: data?.equipment?.id ?? "",
        description: data?.description ?? "",

      }));
    } catch (err) {
      console.error("Failed to fetch equipment log data:", err);
    }
  };

  useEffect(() => {
    if (equpmentLogId) {
      getDataById(equpmentLogId);
    }
    getEquipmentMasterList();
  }, [equpmentLogId]);


  const getEquipmentMasterList = async () => {
    try {
      const data = await getEquipmentListService();
      if (Array.isArray(data) && data.length > 0) {
        const formattedData = data.map(item => ({
          value: item.id,
          label: item.calibrationAgency.trim(),
        }));
        setEquipmentList(formattedData);
      } else {
        setEquipmentList([]);
        console.error("Model list is empty or invalid.");
      }


    } catch (err) {
      console.error("Failed to fetch equipment master list:", err);
      setEquipmentList([]);
    }
  };

  function AutoCalculateTotalHours({ startTime, endTime, setFieldValue }) {
    useEffect(() => {
      if (startTime && endTime) {
        const diff = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60); // in hours
        if (!isNaN(diff)) {
          setFieldValue("totalHours", diff.toFixed(2));
        }
      }
    }, [startTime, endTime, setFieldValue]);

    return null;
  }

  const getMinDate = () => {
    const currentDate = new Date();
    const minYear = currentDate.getFullYear() - 20;
    return new Date(minYear, currentDate.getMonth(), currentDate.getDate());
  };

  const getMaxDate = () => {
    const currentDate = new Date();
    const maxYear = currentDate.getFullYear() + 50;
    return new Date(maxYear, currentDate.getMonth(), currentDate.getDate());
  };

  // Form Validation Schema

  const requiredField = Yup.string().required("This field is required");

  const validationSchema = Yup.object().shape({

    startTime: requiredField,
    endTime: requiredField,
    equipment: requiredField,
    usageDate: requiredField,
    description: requiredField,
    totalHours: requiredField

  });

  const handleSubmit = async (values) => {
    try {
      if (mode === "add") {
        const confirmed = await showConfirmation();
        if (confirmed) {
          const response = await saveEquipmentLogData(values);
          if (response.id != null && response.id > 0) {
            setStatus('list');
            showAlert("Success", "Equipment Log added successfully", "success");
          }
          else {
            showAlert("Error", "Failed to add equipment log. Please try again.", "error");
          }
        }
      } else {
        const confirmed = await showConfirmation();
        if (confirmed) {
          const response = await partialUpdateEquipmentLog(equpmentLogId, values);
          if (response.id != null && response.id > 0) {
            setStatus('list');
            showAlert("Success", "Equipment log updated successfully", "success");
          }
          else {
            showAlert("Error", "Failed to update equipment log. Please try again.", "error");
          }
        }
      }
    } catch (error) {
      showAlert("Error", "Something went wrong. Please try again later.", "error");
    }
  };

  const redirectEquipmentLogList = () => {
    setStatus('list');
  }

  switch (status) {
    case 'list':
      return <EquipmentLog></EquipmentLog>;
    default:
      return (
        <div>
          <Navbar />
          <div className="expert-form-container">
            <div className="form-card">
              <h4 className="form-title">{mode === "add" ? "Add Equipment Usage Log" : "Edit Equipment Usage Log"}</h4>
              <Formik
                initialValues={formData}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  const payload = {
                    ...values,
                    startTime: values.startTime ? values.startTime.toISOString() : "",
                    endTime: values.endTime ? values.endTime.toISOString() : "",
                    usageDate: values.usageDate ? values.usageDate.toISOString() : "",
                    equipment: values.equipment ? { id: values.equipment } : null,
                  };
                  handleSubmit(payload);
                }}
                enableReinitialize={true}
              >
                {({ setFieldValue, setFieldTouched, values }) => (
                  <>
                    <AutoCalculateTotalHours
                      startTime={values.startTime}
                      endTime={values.endTime}
                      setFieldValue={setFieldValue}
                    />
                    <Form>
                      <div className="row">

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="equipment" className="text-start d-block">
                          Calibration Agency: <span className="text-danger">*</span>
                          </label>

                          <FormikSelect
                            name="equipment"
                            options={equipmentList}
                            value={values.equipment}
                            placeholder="Select Equipment Name"
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                          />
                          <ErrorMessage name="equipment" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="usageDate" className="text-start d-block">Usage Date : <span className="text-danger">*</span></label>

                            <DatePicker
                              selected={values.usageDate}
                              onChange={(date) => setFieldValue("usageDate", date)}
                              className="form-control mb-2"
                              placeholderText="Select Usage Date"
                              dateFormat="dd-MM-yyyy"
                              showYearDropdown
                              showMonthDropdown
                              dropdownMode="select"
                              minDate={getMinDate()}
                              maxDate={getMaxDate()}
                              onKeyDown={(e) => e.preventDefault()}
                            />

                            <ErrorMessage
                              name="usageDate"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="startTime" className="text-start d-block">Start Time : <span className="text-danger">*</span></label>

                            <DatePicker
                              selected={values.startTime}
                              onChange={(date) => setFieldValue("startTime", date)}
                              className="form-control mb-2"
                              placeholderText="Select Start Time"
                              dateFormat="dd-MM-yyyy h:mm aa"
                              showYearDropdown
                              showMonthDropdown
                              dropdownMode="select"  
                              showTimeSelect                             
                              timeIntervals={15}                         
                              timeCaption="Time"
                              minDate={getMinDate()}
                              maxDate={getMaxDate()}
                              onKeyDown={(e) => e.preventDefault()}
                              
                            />


                            <ErrorMessage
                              name="startTime"
                              component="div"
                              className="text-danger"
                            />

                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="endTime" className="text-start d-block">End Time : <span className="text-danger">*</span></label>

                            <DatePicker
                              selected={values.endTime}
                              onChange={(date) => setFieldValue("endTime", date)}
                              className="form-control mb-2"
                              placeholderText="Select End Time"
                              dateFormat="dd-MM-yyyy h:mm aa"  
                              showYearDropdown
                              showMonthDropdown
                              dropdownMode="select"
                              showTimeSelect                             
                              timeIntervals={15}                        
                              timeCaption="Time"
                              minDate={getMinDate()}
                              maxDate={getMaxDate()}
                              onKeyDown={(e) => e.preventDefault()}
                              
                            />

                            <ErrorMessage
                              name="endTime"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="totalHours" className="text-start d-block">Total Hours: <span className="text-danger">*</span></label>
                            <Field
                              type="text"
                              name="totalHours"
                              className="form-control mb-2"
                              placeholder="Enter Total Hours"
                              readOnly 

                            />
                            <ErrorMessage name="totalHours" component="div" className="text-danger" />
                          </div>
                        </div>

                        <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="description" className="text-start d-block">Description : <span className="text-danger">*</span></label>
                          <Field
                            type="text"
                            name="description"
                            className="form-control mb-2"
                            placeholder="Enter Description"
                          />
                          <ErrorMessage name="description" component="div" className="text-danger" />
                        </div>
                      </div>

                      </div>
                      <div align="center">
                        <button type="submit" className={`btn ${mode === "add" ? "submit" : "edit"} mt-3`} >
                          {mode === "add" ? "SUBMIT" : "UPDATE"}
                        </button>
                        <button className="btn back mt-3" onClick={() => redirectEquipmentLogList()}>BACK</button>
                      </div>
                    </Form>
                  </>
                )}
              </Formik>
            </div>
          </div>
        </div>
      );
  }
};

export default EquipmentLogAddEditComponent;
