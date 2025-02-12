import { useState } from "react";

export interface JobOffer {
  company?: string;
  positions?: number;
  contractType?: string;
  education?: string;
  location?: string;
  salary?: string;
  deadline?: string;
  link?: string;
}

const JobParserComponent = () => {
  const [inputText, setInputText] = useState("");
  const [jobs, setJobs] = useState<JobOffer[]>([]);

  const handleParse = () => {
    const parsedJobs = parseJobOffers(inputText);
    setJobs(parsedJobs);
  };

  const handleSaveToDB = async () => {
    try {
      const response = await fetch("/api/save-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobs),
      });
      const result = await response.json();
      alert("Datos guardados exitosamente!");
    } catch (error) {
      console.error("Error al guardar en DB", error);
    }
  };

  return (
    <div className="p-4">
      <textarea
        className="w-full h-40 p-2 border rounded"
        placeholder="Pega el texto aquí"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      ></textarea>
      <button
        className="bg-blue-500 text-white p-2 rounded mt-2"
        onClick={handleParse}
      >
        Parsear
      </button>
      <button
        className="bg-green-500 text-white p-2 rounded mt-2 ml-2"
        onClick={handleSaveToDB}
      >
        Guardar en DB
      </button>
      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Contrato</th>
            <th>Educación</th>
            <th>Ubicación</th>
            <th>Salario</th>
            <th>Fecha Límite</th>
            <th>Enlace</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={index}>
              <td>{job.company}</td>
              <td>{job.positions}</td>
              <td>{job.education}</td>
              <td>{job.location}</td>
              <td>{job.salary || "-"}</td>
              <td>{job.deadline}</td>
              <td>
                <a href={job.link} target="_blank" className="text-blue-500">
                  Ver oferta
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobParserComponent;

export function parseJobOffers(text: string): JobOffer[] {
  const jobBlocks = text.split(/▁+/g).filter((block) => block.trim() !== ""); // Dividimos las ofertas
  const jobOffers: JobOffer[] = [];

  jobBlocks.forEach((block) => {
    const lines = block.split("\n").map((line) => line.trim()); // Separar líneas y limpiar espacios
    const job: Partial<JobOffer> = {};

    lines.forEach((line) => {
      if (line.startsWith("🏢")) {
        const match = line.match(/🏢 : (.+?) - (\d+) plaza/);
        if (match) {
          job.company = match[1].trim();
          job.positions = parseInt(match[2]);
        }
      } else if (line.startsWith("📝")) {
        job.contractType = line.replace("📝 :", "").trim();
      } else if (line.startsWith("🎓")) {
        job.education = line.replace("🎓 :", "").trim();
      } else if (line.startsWith("🎯")) {
        job.location = line.replace("🎯 :", "").trim();
      } else if (line.startsWith("💰")) {
        job.salary = line.replace("💰 :", "").trim();
      } else if (line.startsWith("📅")) {
        const match = line.match(/📅 : Finaliza el (\d{2}\/\d{2}\/\d{4})/);
        if (match) {
          job.deadline = match[1].trim();
        }
      } else if (line.startsWith("🔗")) {
        job.link = line.replace("🔗 :", "").trim();
      }
    });

    if (
      job.company &&
      job.positions &&
      job.contractType &&
      job.education &&
      job.location &&
      job.deadline &&
      job.link
    ) {
      jobOffers.push(job as JobOffer);
    }
  });

  return jobOffers;
}

// import React, { useEffect, useState, useRef } from "react";
// import Container from "@mui/material/Container";
// import Paper from "@mui/material/Paper";
// import Button from "@mui/material/Button";
// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import Slide from "@mui/material/Slide";
// import {
//   TextField,
//   InputLabel,
//   FormControl,
//   FormHelperText,
//   MenuItem,
//   Select,
//   Box,
// } from "@mui/material";
// import LoginIcon from "@mui/icons-material/Login";
// import { useFormik } from "formik";
// import * as yup from "yup";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import Compressor from "compressorjs";
// import { ResumeBuilderUseCase } from "../../../../../DataLayer/UseCases/Aplications/ResumeBuilder/ResumeBuilderUseCase";
// import AlertComponent from "../../../../GenericComponents/Alerts/AlertComponent";
// import GenDataTable from "../../../../GenericComponents/DataTable/GenDataTable";
// import Grid from "@mui/material/Grid2";
// import DeleteIcon from "@mui/icons-material/Delete";
// import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
// import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
// import Avatar from "@mui/material/Avatar";
// import { dataURLToBlob } from "blob-util";

// const Transition = React.forwardRef(function Transition(props: any, ref: any) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// export default function ExperienceIndex() {
//   const [actualizar, setActualizar] = useState<any>();
//   const [dataRows, setdataRows] = useState<any>([]);
//   const [open, setOpen] = useState(false);
//   const [image, setImage] = useState<any>(null);
//   const [lRecorte, setLRecorte] = useState(false);
//   const [baseImage, setBaseImage] = useState<any>(null);
//   const cropperRef = useRef<any>(null);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setImage(null);
//     setBaseImage(null);
//     setLRecorte(true);
//     formik.resetForm();
//   };

//   const handleImageChange = (event: any) => {
//     const file = event.currentTarget.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImage(reader.result);
//         setBaseImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//       formik.setFieldValue("imagen", file);
//     }
//   };

//   const handleCrop = () => {
//     const cropper = cropperRef.current.cropper;
//     const croppedImageBase64 = cropper.getCroppedCanvas().toDataURL();

//     const croppedImageBlob = dataURLToBlob(croppedImageBase64);

//     formik.setFieldValue("imagen", croppedImageBlob);
//     setImage(croppedImageBase64);
//     setLRecorte(true);
//   };

//   const restoreCrop = () => {
//     setImage(baseImage);
//     setLRecorte(false);
//   };

//   //=======================================
//   // VALIDATORS
//   //=======================================

//   const validationSchema = yup.object({
//     nombre: yup
//       .string()
//       .min(3, "Requiere mínimo de 3 letras")
//       .required("El nombre es requerido"),
//     descripcion: yup
//       .string()
//       .min(5, "Requiere mínimo de 5 letras")
//       .required("La descripción es requerida"),
//     tipoInstitucion: yup
//       .string()
//       .required("El tipo de institución es requerido"),
//     direccion: yup
//       .string()
//       .min(5, "Requiere mínimo de 5 letras")
//       .required("La dirección es requerida"),
//     fechaInicio: yup.date().required("La fecha de inicio es requerida"),
//     fechaFinalizacion: yup
//       .date()
//       .required("La fecha de finalización es requerida")
//       .min(
//         yup.ref("fechaInicio"),
//         "La fecha de finalización debe ser posterior a la fecha de inicio"
//       ),
//     imagen: yup
//       .mixed()
//       .required("La imagen es requerida")
//       .test("fileFormat", "Formato no soportado", (value: any) =>
//         ["image/jpeg", "image/png", "image/gif"].includes(value?.type)
//       ),
//   });

//   //=======================================
//   // CONSTRUCTOR FORMIK
//   //=======================================

//   const formik = useFormik({
//     initialValues: {
//       nombre: "",
//       descripcion: "",
//       tipoInstitucion: "",
//       direccion: "",
//       fechaInicio: "",
//       fechaFinalizacion: "",
//       imagen: null,
//     },
//     validationSchema: validationSchema,
//     onSubmit: (values, { resetForm }) => {
//       if (lRecorte) {
//         registrarInstitucion(values);
//         resetForm();
//         setImage(null);
//         setBaseImage(null);
//         setLRecorte(false);
//       } else {
//         AlertComponent("info", "Recorte la Imagen...");
//       }
//     },
//   });

//   const compressImage = (image: any) => {
//     return new Promise((resolve, reject) => {
//       new Compressor(image, {
//         quality: 0.7,
//         success(result) {
//           resolve(result);
//         },
//         error(err) {
//           reject(err);
//         },
//       });
//     });
//   };

//   //=======================================
//   // SUBMIT
//   //=======================================

//   const registrarInstitucion = async (values:any) => {
//     setOpen(false);
//     try {
//       const imgInst = await new ResumeBuilderUseCase().SetImgInstitution({
//         name: values.nombre,
//         blob: await compressImage(values.imagen),
//       });

//       const objData = await new ResumeBuilderUseCase().SetExperience({
//         name: values.nombre,
//         description: values.descripcion,
//         typeInst: values.tipoInstitucion,
//         adress: values.direccion,
//         dateInit: values.fechaInicio,
//         dateOut: values.fechaFinalizacion,
//         ImgLogo: imgInst,
//       });

//       if (objData.success) {
//         AlertComponent("success", objData.message);
//         setActualizar(new Date());
//       } else {
//         AlertComponent("error", objData.message);
//       }
//     } catch (e:any) {
//       AlertComponent("error", e.message);
//     }
//   };

//   //=======================================
//   // DATATABLE
//   //=======================================

//   const columns = [
//     {
//       name: <SettingsSuggestIcon />,
//       idName: "Actions",
//       selector: (row: any) => row?.Actions,
//       with: "50px",
//     },
//     {
//       name: <InsertPhotoIcon />,
//       idName: "logo",
//       selector: (row: any) => row?.logo,
//       with: "10px",
//     },
//     {
//       name: "NOMBRE",
//       idName: "cNombre",
//       selector: (row: any) => row?.cNombre,
//       cell: (row: any) => <div>{row?.cNombre}</div>,
//       with: "400px",
//       sortable: true,
//     },
//     {
//       name: "DESCRIPCIÓN",
//       idName: "cDescription",
//       selector: (row: any) => row?.cDescription,
//       cell: (row: any) => <div>{row?.cDescription}</div>,
//       with: "200px",
//     },
//     {
//       name: "TIPO",
//       idName: "cTipoInstitucion",
//       selector: (row: any) => row?.cTipoInstitucion,
//       cell: (row: any) => <div>{row?.cTipoInstitucion}</div>,
//       with: "100px",
//     },
//     {
//       name: "DIRECCIÓN",
//       idName: "cDireccion",
//       selector: (row: any) => row?.cDireccion,
//       cell: (row: any) => <div>{row?.cDireccion}</div>,
//       with: "150px",
//     },
//     {
//       name: "DATE IN",
//       idName: "cDateInicial",
//       selector: (row: any) => row?.cDateInicial,
//       cell: (row: any) => <div>{row?.cDateInicial}</div>,
//       with: "100px",
//     },
//     {
//       name: "DATE OUT",
//       idName: "cDateFinal",
//       selector: (row: any) => row?.cDateFinal,
//       cell: (row: any) => <div>{row?.cDateFinal}</div>,
//       with: "100px",
//     },
//   ];

//   //============================
//   //CARGAR DATA TABLE INICIAL
//   //============================

//   const ObternerData = async () => {
//     try {
//       const objData = await new ResumeBuilderUseCase().GetAllExperience();
//       if (objData?.success) {
//         const rows: Array<any> = [];
//         objData?.data.forEach((items: any) => {
//           rows.push({
//             Actions: (
//               <div
//                 style={{
//                   color: "white",
//                   background: "red",
//                   borderRadius: "5px",
//                   padding: "3px",
//                   cursor: "pointer",
//                   marginRight: "3px",
//                 }}
//                 //onClick={() => AlertDeleteExperience(items)}
//               >
//                 <DeleteIcon />
//               </div>
//             ),
//             cNombre: items?.data?.name,
//             cDescription: items?.data?.description,
//             cTipoInstitucion: items?.data?.typeInst,
//             cDireccion: items?.data?.adress,
//             cDateInicial: items?.data?.dateInit,
//             cDateFinal: items?.data?.dateOut,
//             logo: (
//               <Avatar
//                 sx={{ width: 35, height: 35 }}
//                 alt="Remy Sharp"
//                 src={items?.data?.ImgLogo}
//               />
//             ),
//           });
//         });
//         setdataRows(rows);
//       } else {
//         AlertComponent("error", objData?.message);
//       }
//     } catch (error:any) {
//       AlertComponent("error", error.message);
//     }
//   };

//   useEffect(() => {
//     ObternerData();
//   }, [actualizar]);
//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Paper
//         sx={{
//           p: 2,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "auto",
//         }}
//       >
//         <Button
//           variant="contained"
//           onClick={handleClickOpen}
//           sx={{ width: "200px" }}
//         >
//           REGISTRAR EXPERIENCIA
//         </Button>

//         <GenDataTable columns={columns} data={dataRows} />

//         <Dialog
//           open={open}
//           TransitionComponent={Transition}
//           keepMounted
//           onClose={handleClose}
//           maxWidth="xs"
//         >
//           <DialogTitle>{"REGISTRAR EXPERIENCIA"}</DialogTitle>
//           <DialogContent>
//             <form onSubmit={formik.handleSubmit}>
//               <TextField
//                 fullWidth
//                 id="nombre"
//                 name="nombre"
//                 label="Nombre"
//                 variant="standard"
//                 type="text"
//                 value={formik.values?.nombre}
//                 onChange={(event) => {
//                   const value = event.target.value.toUpperCase();
//                   formik.setFieldValue("nombre", value);
//                 }}
//                 error={formik.touched?.nombre && Boolean(formik.errors?.nombre)}
//                 helperText={formik.touched?.nombre && formik.errors?.nombre}
//               />

//               <TextField
//                 fullWidth
//                 id="descripcion"
//                 name="descripcion"
//                 label="Descripción"
//                 variant="standard"
//                 multiline
//                 rows={4}
//                 value={formik.values?.descripcion}
//                 onChange={formik.handleChange}
//                 error={
//                   formik.touched?.descripcion &&
//                   Boolean(formik.errors?.descripcion)
//                 }
//                 helperText={
//                   formik.touched?.descripcion && formik.errors?.descripcion
//                 }
//               />

//               <FormControl
//                 fullWidth
//                 variant="standard"
//                 error={
//                   formik.touched?.tipoInstitucion &&
//                   Boolean(formik.errors?.tipoInstitucion)
//                 }
//               >
//                 <InputLabel htmlFor="tipoInstitucion">
//                   Tipo de Institución
//                 </InputLabel>
//                 <Select
//                   fullWidth
//                   id="tipoInstitucion"
//                   name="tipoInstitucion"
//                   value={formik.values?.tipoInstitucion}
//                   onChange={formik.handleChange}
//                 >
//                   <MenuItem value={"publica"}>Pública</MenuItem>
//                   <MenuItem value={"privada"}>Privada</MenuItem>
//                   <MenuItem value={"sinFinesDeLucro"}>
//                     Sin Fines de Lucro
//                   </MenuItem>
//                 </Select>
//                 <FormHelperText
//                   error={
//                     formik.touched?.tipoInstitucion &&
//                     Boolean(formik.errors?.tipoInstitucion)
//                   }
//                 >
//                   {formik.touched?.tipoInstitucion &&
//                     formik.errors?.tipoInstitucion}
//                 </FormHelperText>
//               </FormControl>

//               <TextField
//                 fullWidth
//                 id="direccion"
//                 name="direccion"
//                 label="Dirección"
//                 variant="standard"
//                 type="text"
//                 value={formik.values?.direccion}
//                 onChange={formik.handleChange}
//                 error={
//                   formik.touched?.direccion && Boolean(formik.errors?.direccion)
//                 }
//                 helperText={
//                   formik.touched?.direccion && formik.errors?.direccion
//                 }
//               />
//               <Grid container spacing={2}>
//                 <Grid size={{ xs: 12, md: 6, lg: 6 }}>
//                   <TextField
//                     fullWidth
//                     variant="standard"
//                     id="fechaInicio"
//                     name="fechaInicio"
//                     label="Fecha de Inicio"
//                     type="date"
//                     // InputLabelProps={{
//                     //   shrink: true,
//                     // }}
//                     value={formik.values?.fechaInicio}
//                     onChange={formik.handleChange}
//                     error={
//                       formik.touched?.fechaInicio &&
//                       Boolean(formik.errors?.fechaInicio)
//                     }
//                     helperText={
//                       formik.touched?.fechaInicio && formik.errors?.fechaInicio
//                     }
//                   />
//                 </Grid>
//                 <Grid size={{ xs: 12, md: 6, lg: 6 }}>
//                   <TextField
//                     fullWidth
//                     variant="standard"
//                     id="fechaFinalizacion"
//                     name="fechaFinalizacion"
//                     label="Fecha de Finalización"
//                     type="date"
//                     // InputLabelProps={{
//                     //   shrink: true,
//                     // }}
//                     value={formik.values?.fechaFinalizacion}
//                     onChange={formik.handleChange}
//                     error={
//                       formik.touched?.fechaFinalizacion &&
//                       Boolean(formik.errors?.fechaFinalizacion)
//                     }
//                     helperText={
//                       formik.touched?.fechaFinalizacion &&
//                       formik.errors?.fechaFinalizacion
//                     }
//                   />
//                 </Grid>
//               </Grid>

//               <Button
//                 variant="contained"
//                 component="label"
//                 sx={{ mt: 2, mb: 2, background: "red" }}
//               >
//                 Subir Imagen
//                 <input
//                   type="file"
//                   hidden
//                   accept="image/*"
//                   onChange={handleImageChange}
//                 />
//               </Button>
//               {formik.touched.imagen && formik.errors.imagen ? (
//                 <FormHelperText error>{formik.errors.imagen}</FormHelperText>
//               ) : null}

//               {image && (
//                 <div>
//                   <Cropper
//                     src={image}
//                     initialAspectRatio={1}
//                     aspectRatio={1}
//                     guides={true}
//                     cropBoxResizable={true}
//                     cropBoxMovable={true}
//                     dragMode="move"
//                     viewMode={2}
//                     responsive={true}
//                     background={true}
//                     autoCropArea={1}
//                     ref={cropperRef}
//                   />
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       mt: 2,
//                     }}
//                   >
//                     <Button
//                       variant="contained"
//                       onClick={handleCrop}
//                       sx={{ background: "green", width: "48%" }}
//                     >
//                       Recortar Imagen
//                     </Button>
//                     <Button
//                       variant="contained"
//                       onClick={restoreCrop}
//                       sx={{ background: "red", width: "48%" }}
//                     >
//                       Restaurar Imagen
//                     </Button>
//                   </Box>
//                 </div>
//               )}

//               <Button
//                 fullWidth
//                 sx={{ marginBottom: "10px", marginTop: "15px" }}
//                 color="primary"
//                 variant="contained"
//                 type="submit"
//                 endIcon={<LoginIcon />}
//               >
//                 Registrar
//               </Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </Paper>
//     </Container>
//   );
// }
