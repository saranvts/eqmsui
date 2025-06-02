import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../datatable/master.css";
import { saveMakeData, partialUpdateMake, getMakeById } from "../../services/masterservice";
import { showAlert, showConfirmation } from "../datatable/swalHelper";
import Make from "./make";
import Navbar from "../navbar/navbar";

const MakeAddEditComponent = ({ mode, makeId }) => {

  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: ""
  });

  const getDataById = async (makeId) => {
    try {
      const data = await getMakeById(makeId);
      if (!data) return;

      setFormData(prev => ({
        ...prev,
        id: data?.id ?? "",
        name: data?.name ?? ""

      }));
    } catch (err) {
      console.error("Failed to fetch make data:", err);
    }
  };

  useEffect(() => {
    if (makeId) {
      getDataById(makeId);
    }
  }, [makeId]);

  // Form Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("This field is required.")

  });

  const handleSubmit = async (values) => {
    try {
      if (mode === "add") {
        const confirmed = await showConfirmation();
        if (confirmed) {
          const response = await saveMakeData(values);
          if (response.id != null && response.id > 0) {
            setStatus('list');
            showAlert("Success", "Make added successfully", "success");
          }
          else {
            showAlert("Error", "Failed to add make. Please try again.", "error");
          }
        }
      } else {
        const confirmed = await showConfirmation();
        if (confirmed) {
          const response = await partialUpdateMake(makeId, values);
          if (response.id != null && response.id > 0) {
            setStatus('list');
            showAlert("Success", "Make updated successfully", "success");
          }
          else {
            showAlert("Error", "Failed to update make. Please try again.", "error");
          }
        }
      }
    } catch (error) {
      showAlert("Error", "Something went wrong. Please try again later.", "error");
    }
  };

  const redirectMakeList = () => {
    setStatus('list');
  }

  switch (status) {
    case 'list':
      return <Make></Make>;
    default:
      return (
        <div>
          <Navbar />
          <div className="expert-form-container">
            <div className="form-card">
              <h4 className="form-title">{mode === "add" ? "Add Make" : "Edit Make"}</h4>
              <Formik
                initialValues={formData}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}
                enableReinitialize={true}
              >
                {() => (
                  <Form>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <label htmlFor="name" className="text-start d-block">Make Name : <span className="text-danger">*</span></label>
                          <Field
                            type="text"
                            name="name"
                            className="form-control mb-2"
                            placeholder="Enter Make Name"
                          />
                          <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>
                      </div>
                    </div>
                    <div align="center">
                      <button type="submit" className={`btn ${mode === "add" ? "submit" : "edit"} mt-3`} >
                        {mode === "add" ? "SUBMIT" : "UPDATE"}
                      </button>
                      <button className="btn back mt-3" onClick={() => redirectMakeList()}>BACK</button>
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

export default MakeAddEditComponent;
