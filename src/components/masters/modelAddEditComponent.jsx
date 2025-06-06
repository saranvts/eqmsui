import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../datatable/master.css";
import { saveModelData, partialUpdateModel, getModelById } from "../../services/masterservice";
import { showAlert, showConfirmation } from "../datatable/swalHelper";
import Model from "./model";
import Navbar from "../navbar/navbar";

const ModelAddEditComponent = ({ mode, modelId }) => {

  const [status, setStatus] = useState('');

  const [formData, setFormData] = useState({
    name: ""
  });

  const getDataById = async (modelId) => {
    try {
      const data = await getModelById(modelId);
      if (!data) return;

      setFormData(prev => ({
        ...prev,
        id: data?.id ?? "",
        name: data?.name ?? ""

      }));
    } catch (err) {
      console.error("Failed to fetch model data:", err);
    }
  };

  useEffect(() => {
    if (modelId) {
      getDataById(modelId);
    }
  }, [modelId]);

  // Form Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
    .max(250, "Model name must be at most 250 characters")
    .required("This field is required.")  

  });

  const handleSubmit = async (values) => {
    try {
      if (mode === "add") {
        const confirmed = await showConfirmation();
        if (confirmed) {
          const response = await saveModelData(values);
          if (response.id != null && response.id > 0) {
            setStatus('list');
            showAlert("Success", "Model added successfully", "success");
          }
          else {
            showAlert("Error", "Failed to add model. Please try again.", "error");
          }
        }
      } else {
        const confirmed = await showConfirmation();
        if (confirmed) {
          const response = await partialUpdateModel(modelId, values);
          if (response.id != null && response.id > 0) {
            setStatus('list');
            showAlert("Success", "Model updated successfully", "success");
          }
          else {
            showAlert("Error", "Failed to update model. Please try again.", "error");
          }
        }
      }
    } catch (error) {
      showAlert("Error", "Something went wrong. Please try again later.", "error");
    }
  };

  const redirectModelList = () => {
    setStatus('list');
  }

  switch (status) {
    case 'list':
      return <Model></Model>;
    default:
      return (
        <div>
          <Navbar />
          <div className="expert-form-container">
            <div className="form-card">
              <h4 className="form-title">{mode === "add" ? "Add Model" : "Edit Model"}</h4>
              <Formik
                initialValues={formData}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}
                enableReinitialize={true}
              >
                {() => (
                  <Form>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="name" className="text-start d-block">Model Name : <span className="text-danger">*</span></label>
                          <Field
                            as="textarea"  
                            name="name"
                            className="form-control mb-2"
                            placeholder="Enter Model Name"
                            rows={4}    
                          />
                          <ErrorMessage name="name" component="div" className="text-danger text-start" />
                        </div>
                      </div>
                    </div>
                    <div align="center">
                      <button type="submit" className={`btn ${mode === "add" ? "submit" : "edit"} mt-3`}>
                        {mode === "add" ? "SUBMIT" : "UPDATE"}
                      </button>
                      <button className="btn back mt-3" onClick={() => redirectModelList()}>BACK</button>
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

export default ModelAddEditComponent;
