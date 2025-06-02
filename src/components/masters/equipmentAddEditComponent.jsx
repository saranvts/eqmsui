import { useEffect, useState, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../datatable/master.css";
import { saveEquipmentData, partialUpdateEquipment, getEquipmentById, getModelListService, getMakeListService, getEquipmentListService } from "../../services/masterservice";
import { showAlert, showConfirmation } from "../datatable/swalHelper";
import Equipment from "./equipment";
import Navbar from "../navbar/navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormikSelect from "../../common/formikSelect";


const EquipmentAddEditComponent = ({ mode, equipmentId }) => {

  const [status, setStatus] = useState('');
  const [modelList, setModelList] = useState([]);
  const [makeList, setMakeList] = useState([]);
  const [serialNumberList, setSerialNumberList] = useState([]);
 

  const [formData, setFormData] = useState({

    calibrationAgency: "",
    calibrationDate: "",
    calibrationDueDate: "",
    itemCost: "",
    itemSerialNumber: "",
    location: "",
    procuredBy: "",
    procuredOn: "",
    projectSsrNo: "",
    serviceStatus: "",
    specification: "",
    usedBy: "",
    model: "",
    make: "",

  });



  const getDataById = async (equipmentId) => {
    try {
      const data = await getEquipmentById(equipmentId);
      if (!data) return;

      setFormData(prev => ({
        ...prev,
        id: data?.id ?? "",
        calibrationAgency: data?.calibrationAgency ?? "",
        calibrationDate: data?.calibrationDate ?? "",
        calibrationDueDate: data?.calibrationDueDate ?? "",
        itemCost: data?.itemCost ?? 0,
        itemSerialNumber: data?.itemSerialNumber ?? "",
        location: data?.location ?? "",
        procuredBy: data?.procuredBy ?? "",
        procuredOn: data?.procuredOn ?? "",
        projectSsrNo: data?.projectSsrNo ?? "",
        serviceStatus: data?.serviceStatus ?? "",
        specification: data?.specification ?? "",
        usedBy: data?.usedBy ?? "",
        model: data?.model?.id ?? "",
        make: data?.make?.id ?? "",

      }));
    } catch (err) {
      console.error("Failed to fetch equipment data:", err);
    }
  };

  useEffect(() => {
    if (equipmentId) {
      getDataById(equipmentId);
    }
    getModelAndMakeAndEquipmentMasterList();
  }, [equipmentId]);

  const getModelAndMakeAndEquipmentMasterList = async () => {
    try {
      const data = await getModelListService();
      if (Array.isArray(data) && data.length > 0) {
        const formattedData = data.map(item => ({
          value: item.id,
          label: item.name.trim(),
        }));
        setModelList(formattedData);
      } else {
        setModelList([]);
        console.error("Model list is empty or invalid.");
      }

      const makeData = await getMakeListService();
      if (Array.isArray(makeData) && makeData.length > 0) {
        const formattedMakeData = makeData.map(item => ({
          value: item.id,
          label: item.name.trim(),
        }));
        setMakeList(formattedMakeData);
      } else {
        setMakeList([]);
        console.error("Make list is empty or invalid.");
      }

      const equipmentData = await getEquipmentListService();
      if (Array.isArray(equipmentData) && equipmentData.length > 0) {
        const serialnumberlist = equipmentData.map(item => item.itemSerialNumber);
        setSerialNumberList(serialnumberlist);
      } else {
        setSerialNumberList([]);
        console.error("Equipment list is empty or invalid.");
      }

    } catch (err) {
      console.error("Failed to fetch model or make or equipment list:", err);
      setModelList([]);
      setMakeList([]);
      setSerialNumberList([]);
    }
  };

  // Form Validation Schema

  const stringWithCommonRules = (label) =>
    Yup.string()
      .min(2, `${label} must be at least 2 characters`)
      .max(100, `${label} must be at most 100 characters`)
      .required(`${label} is required`);

  const requiredField = Yup.string().required("This field is required");

  const formValidationSchema = (serialNumberList) => Yup.object().shape({

    calibrationAgency: stringWithCommonRules("Calibration agency"),
    projectSsrNo: stringWithCommonRules("Project SSR number"),
    itemSerialNumber: stringWithCommonRules("Serial number")
    .notOneOf(serialNumberList, "Serial number already exists"),
    location: stringWithCommonRules("Location"),
    usedBy: stringWithCommonRules("Used by"),
    specification: stringWithCommonRules("Specification"),
    procuredBy: stringWithCommonRules("Procured by"),

    serviceStatus: requiredField,
    calibrationDate: requiredField,
    calibrationDueDate: requiredField,
    procuredOn: requiredField,
    make: requiredField,
    model: requiredField,

    itemCost: Yup.number()
      .typeError("Item Cost must be a number")
      .positive("Item Cost must be greater than zero")
      .max(9999999999, "Item Cost is too large")
      .test(
        "maxDigitsAfterDecimal",
        "Item Cost must have at most 2 decimal places",
        (value) => value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
      )
      .required("Item Cost is required"),

  });


  const validationSchema = useMemo(() => {
    const filteredList = serialNumberList.filter( (serial) => serial !== formData.itemSerialNumber );
    return formValidationSchema(filteredList);
  }, [serialNumberList, formData.itemSerialNumber]);
  

  const handleSubmit = async (values) => {
    try {
      if (mode === "add") {
        const confirmed = await showConfirmation();
        if (confirmed) {
          const response = await saveEquipmentData(values);
          if (response.id != null && response.id > 0) {
            setStatus('list');
            showAlert("Success", "Equipment added successfully", "success");
          }
          else {
            showAlert("Error", "Failed to add equipment. Please try again.", "error");
          }
        }
      } else {
        const confirmed = await showConfirmation();
        if (confirmed) {
          const response = await partialUpdateEquipment(equipmentId, values);
          if (response.id != null && response.id > 0) {
            setStatus('list');
            showAlert("Success", "Equipment updated successfully", "success");
          }
          else {
            showAlert("Error", "Failed to update equipment. Please try again.", "error");
          }
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      showAlert("Error", "Something went wrong. Please try again later.", "error");
    }
  };

  const redirectEquipmentList = () => {
    setStatus('list');
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

  switch (status) {
    case 'list':
      return <Equipment></Equipment>;
    default:
      return (
        <div>
          <Navbar />
          <div className="expert-form-container">
            <div className="form-card">
              <h4 className="form-title">{mode === "add" ? "Add Equipment" : "Edit Equipment"}</h4>
              <Formik
                initialValues={formData}
                 validationSchema={validationSchema}
                onSubmit={(values) => {
                  const payload = {
                    ...values,
                    model: values.model ? { id: values.model } : null,
                    make: values.make ? { id: values.make } : null,
                  };
                  handleSubmit(payload);
                }}

                enableReinitialize={true}
              >
                {({ setFieldValue, setFieldTouched, values }) => (
                  <Form>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="calibrationAgency" className="text-start d-block">Calibration Agency : <span className="text-danger">*</span></label>
                          <Field
                            type="text"
                            name="calibrationAgency"
                            className="form-control mb-2"
                            placeholder="Enter Calibration Agency"
                          />
                          <ErrorMessage name="calibrationAgency" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="calibrationDate" className="text-start d-block">Calibraton Date : <span className="text-danger">*</span></label>

                          <DatePicker
                            selected={values.calibrationDate}
                            onChange={(date) => setFieldValue("calibrationDate", date)}
                            className="form-control mb-2"
                            placeholderText="Select Calibraton Date"
                            dateFormat="dd-MM-yyyy"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            minDate={getMinDate()}
                            maxDate={getMaxDate()}
                            onKeyDown={(e) => e.preventDefault()}
                          />

                          <ErrorMessage name="calibrationDate" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="calibrationDueDate" className="text-start d-block">Calibraton Due Date : <span className="text-danger">*</span></label>

                          <DatePicker
                            selected={values.calibrationDueDate}
                            onChange={(date) => setFieldValue("calibrationDueDate", date)}
                            className="form-control mb-2"
                            placeholderText="Select Calibraton Due Date"
                            dateFormat="dd-MM-yyyy"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            minDate={getMinDate()}
                            maxDate={getMaxDate()}
                            onKeyDown={(e) => e.preventDefault()}
                          />

                          <ErrorMessage name="calibrationDueDate" component="div" className="text-danger" />
                        </div>
                      </div>


                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="itemCost" className="text-start d-block">Item Cost : <span className="text-danger">*</span></label>
                          <Field
                            type="text"
                            name="itemCost"
                            className="form-control mb-2"
                            placeholder="Enter Item Cost"
                          />
                          <ErrorMessage name="itemCost" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="itemSerialNumber" className="text-start d-block">Serial Number: <span className="text-danger">*</span></label>
                          <Field
                            type="text"
                            name="itemSerialNumber"
                            className="form-control mb-2"
                            placeholder="Enter Serial Number"
                          />
                          <ErrorMessage name="itemSerialNumber" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="location" className="text-start d-block">Location : <span className="text-danger">*</span></label>
                          <Field
                            type="text"
                            name="location"
                            className="form-control mb-2"
                            placeholder="Enter Location"
                          />
                          <ErrorMessage name="location" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="procuredBy" className="text-start d-block">Procured By : <span className="text-danger">*</span></label>
                          <Field
                            type="text" name="procuredBy" className="form-control mb-2" placeholder="Enter Procured By" />
                          <ErrorMessage name="procuredBy" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="procuredOn" className="text-start d-block">Procured On : <span className="text-danger">*</span></label>

                          <DatePicker
                            selected={values.procuredOn}
                            onChange={(date) => setFieldValue("procuredOn", date)}
                            className="form-control mb-2"
                            placeholderText="Select Calibraton Due Date"
                            dateFormat="dd-MM-yyyy"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            minDate={getMinDate()}
                            maxDate={getMaxDate()}
                            onKeyDown={(e) => e.preventDefault()}
                          />

                          <ErrorMessage name="procuredOn" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="projectSsrNo" className="text-start d-block">Project SSR Number: <span className="text-danger">*</span></label>
                          <Field type="text" name="projectSsrNo" className="form-control mb-2" placeholder="Enter Project SSR Number" />

                          <ErrorMessage name="projectSsrNo" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="serviceStatus" className="text-start d-block"> Service Status: <span className="text-danger">*</span></label>

                          <Field
                            as="select"
                            name="serviceStatus"
                            className="form-control mb-2"
                          >
                            <option value="">--Select--</option>
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </Field>

                          <ErrorMessage name="serviceStatus" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="specification" className="text-start d-block">Specification : <span className="text-danger">*</span></label>
                          <Field
                            type="text" name="specification" className="form-control mb-2" placeholder="Enter Specification" />
                          <ErrorMessage name="specification" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="usedBy" className="text-start d-block">Used By : <span className="text-danger">*</span></label>
                          <Field
                            type="text" name="usedBy" className="form-control mb-2" placeholder="Enter Used By" />
                          <ErrorMessage name="usedBy" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="model" className="text-start d-block">
                            Model Name: <span className="text-danger">*</span>
                          </label>

                          <FormikSelect
                            name="model"
                            options={modelList}
                            value={values.model}
                            placeholder="Select Model Name"
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                          />
                          <ErrorMessage name="model" component="div" className="text-danger" />
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="make" className="text-start d-block">
                            Make Name: <span className="text-danger">*</span>
                          </label>

                          <FormikSelect
                            name="make"
                            options={makeList}
                            value={values.make}
                            placeholder="Select Make Name"
                            onChange={setFieldValue}
                            onBlur={setFieldTouched}
                          />
                          <ErrorMessage name="make" component="div" className="text-danger" />
                        </div>
                      </div>

                    </div>
                    <div align="center">
                      <button type="submit" className={`btn ${mode === "add" ? "submit" : "edit"} mt-3`} >
                        {mode === "add" ? "SUBMIT" : "UPDATE"}
                      </button>
                      <button className="btn back mt-3" onClick={() => redirectEquipmentList()}>BACK</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      );
  }
};

export default EquipmentAddEditComponent;
