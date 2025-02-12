import React, { useEffect, useState } from "react";
import { parse, format, parseISO, isToday, isAfter } from "date-fns";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import DeleteIcon from "@mui/icons-material/Delete";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

import GenDataTable from "../../../../../GenericComponents/DataTable/GenDataTable";
import { JobOfferEntity } from "../../../../../../DomainLayer/Models/Aplication/Modules/Example/JobsEntity";
import JobsUseCase from "../../../../../../DataLayer/UseCases/Aplications/Example/Jobs/JobsUseCase";
import parseJobOffers from "./parseJobOffers";
import { IJobs } from "../../../../../../DomainLayer/Interfaces/Aplication/Example/IJobs";
import AlertComponent from "../../../../../GenericComponents/Alerts/AlertComponent";
import { date } from "yup";

type TablaJobsEntity = {
  Actions: any;
  company?: string;
  description?: string;
  salary?: string;
  deadline?: string;
  link?: string;
  vigent: string;
};

const JobsIndex = () => {
  const [inputText, setInputText] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<Array<IJobs.NsJobOffer>>([]);
  const [rowsDataTable, setRowsDatatable] = useState<Array<TablaJobsEntity>>(
    []
  );

  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [onlyToday, setOnlyToday] = useState(false);

  const SaveJobs = async () => {
    setOpen(false);
    const parsedJobs = parseJobOffers(inputText);
    try {
      const response = await new JobsUseCase().insert(parsedJobs);
      if (response) {
        Load();
        setInputText("");
        AlertComponent("success", "Datos guardados exitosamente!");
      }
    } catch (e: any) {
      AlertComponent("error", e.message);
    }
  };

  const filteredJobs = items
    .filter((job) => isAfter(parseISO(job.deadline || ""), new Date())) // Vigentes
    .filter((job) => {
      const salary = parseInt(job.salary || "0", 10);
      const min = minSalary ? parseInt(minSalary, 10) : 0;
      const max = maxSalary ? parseInt(maxSalary, 10) : Number.MAX_VALUE;
      return salary >= min && salary <= max;
    })
    .filter((job) => {
      return filterDate ? job.deadline === filterDate : true;
    })
    .filter((job) => {
      return onlyToday ? isToday(parseISO(job.deadline || "")) : true;
    });

  //=======================================================================
  // CARGAR DATA TABLE INICIAL
  //=======================================================================

  const LoadInDataTable = async (items: Array<IJobs.NsJobOffer>) => {
    const rows: Array<TablaJobsEntity> = [];
    items?.forEach((items: IJobs.NsJobOffer) => {
      rows.push({
        Actions: (
          <>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  color: "white",
                  background: "red",
                  borderRadius: "5px",
                  padding: "3px",
                  cursor: "pointer",
                  marginRight: "3px",
                }}
                // onClick={() => ButtonDeleteCryptoItem(items)}
              >
                <DeleteIcon />
              </div>
            </div>
          </>
        ),
        company: items?.company,
        description:
          items?.location +
          ": " +
          items?.positions +
          " \n " +
          items?.contractType +
          " \n\n " +
          items?.education,
        salary: items?.salary,
        deadline: format(
          parse(items?.deadline ?? "", "dd/MM/yyyy", new Date()),
          "yyyy/MM/dd"
        ),
        link: items?.link,
        vigent: items.vigent ? "SI" : "NO",
      });
    });

    setRowsDatatable(rows);
  };

  const Load = async () => {
    try {
      const items = await new JobsUseCase().Get();
      if (items?.length !== 0) {
        setItems(items);
        LoadInDataTable(items);
      }
    } catch (error: any) {
      AlertComponent("error", error.message);
    }
  };

  useEffect(() => {
    if (rowsDataTable.length === 0) {
      Load();
    }
  }, []);

  // useEffect(() => {
  //   LoadInDataTable(filteredJobs);
  // }, [onlyToday, filterDate, maxSalary, minSalary]);

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => {
            setOpen(true);
          }}
        >
          INPORT DATA
        </Button>

        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <TextField
            label="Salario Mínimo"
            variant="outlined"
            size="small"
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
          <TextField
            label="Salario Máximo"
            variant="outlined"
            size="small"
            type="number"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
          />
          <TextField
            label="Fecha límite"
            type="date"
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setOnlyToday(!onlyToday);
            }}
          >
            {onlyToday ? "Ver Todos" : "Solo Hoy"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setMinSalary("");
              setMaxSalary("");
              setFilterDate("");
              setOnlyToday(false);
              LoadInDataTable(items);
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => LoadInDataTable(filteredJobs)}
          >
            Aplicar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => LoadInDataTable(filteredJobs)}
          >
            CLEAN PASADAS
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => LoadInDataTable(filteredJobs)}
          >
            VER POSTULADAS
          </Button>
        </div>

        <TableCrypto dataRows={rowsDataTable} />

        <Dialog
          fullScreen
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  setOpen(false);
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                NEW IMPORT
              </Typography>
              <Button
                autoFocus
                color="inherit"
                onClick={() => {
                  setOpen(false);
                }}
              >
                CLOSE
              </Button>
            </Toolbar>
          </AppBar>
          <TextField
            label="Jobs"
            multiline
            rows={15}
            variant="outlined"
            fullWidth
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
            fullWidth
            onClick={SaveJobs}
          >
            SAVE
          </Button>
        </Dialog>
      </Container>
    </Box>
  );
};

const TableCrypto = ({ dataRows }: { dataRows: Array<TablaJobsEntity> }) => {
  const columns = [
    {
      name: (
        <SettingsSuggestIcon style={{ margin: "auto", textAlign: "center" }} />
      ),
      idName: "Actions",
      selector: (row: TablaJobsEntity) => row?.Actions,
      cell: (row: TablaJobsEntity) => (
        <div style={{ margin: "auto", textAlign: "center" }}>
          {row?.Actions}
        </div>
      ),
      width: "80px",
    },
    {
      name: "FECHA",
      idName: "deadline",
      selector: (row: TablaJobsEntity) => row?.deadline,
      cell: (row: TablaJobsEntity) => <>{row?.deadline}</>,
      width: "100px",
    },
    {
      name: "SALARY",
      idName: "salary",
      selector: (row: TablaJobsEntity) => row?.salary,
      cell: (row: TablaJobsEntity) => <>{row?.salary}</>,
      width: "100px",
    },
    {
      name: "COMPANY",
      idName: "company",
      selector: (row: TablaJobsEntity) => row?.company,
      cell: (row: TablaJobsEntity) => <>{row?.company}</>,
      style: { fontWeight: "bold" },
      sortable: true,
      width: "150px",
    },
    {
      name: "DESCRIPCIÓN",
      idName: "description",
      selector: (row: TablaJobsEntity) => row?.description,
      cell: (row: TablaJobsEntity) => <>{row?.description}</>,
    },
    {
      name: "LINK",
      idName: "link",
      selector: (row: TablaJobsEntity) => row?.link,
      cell: (row: TablaJobsEntity) => (
        <a
          href={row?.link}
          target="_blank"
          className="text-blue-500"
          style={{ color: "#00a22a" }}
        >
          Ver oferta
        </a>
      ),
      width: "100px",
    },
  ];

  return <GenDataTable columns={columns} data={dataRows} />;
};

export default JobsIndex;
