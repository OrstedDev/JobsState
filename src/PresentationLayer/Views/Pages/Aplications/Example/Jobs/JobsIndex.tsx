import React, { useEffect, useState, useMemo } from "react";
import { parse, format, parseISO, isToday, isAfter } from "date-fns";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { TextField, Stack } from "@mui/material";
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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel, FormControl } from "@mui/material";

import GenDataTable from "../../../../../GenericComponents/DataTable/GenDataTable";
import JobsUseCase from "../../../../../../DataLayer/UseCases/Aplications/Example/Jobs/JobsUseCase";
import parseJobOffers from "./parseJobOffers";
import { IJobs } from "../../../../../../DomainLayer/Interfaces/Aplication/Example/IJobs";
import AlertComponent from "../../../../../GenericComponents/Alerts/AlertComponent";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type TablaJobsEntity = {
  Actions: any;
  company?: string;
  description?: string;
  salary?: string;
  date?: string;
  deadline?: string;
  link?: string;
  state: any;
};

const JobsIndex = () => {
  const [inputText, setInputText] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<Array<IJobs.NsJobOffer>>([]);
  const [rowsDataTable, setRowsDatatable] = useState<Array<TablaJobsEntity>>(
    []
  );

  const [minSalary, setMinSalary] = useState("");
  const [onlyToday, setOnlyToday] = useState(false);
  const [postulate, setPostulate] = useState(false);

  //=======================================================================
  // DELETE
  //=======================================================================

  const deleteItem = async (_Id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item._Id !== _Id));

    const item = await new JobsUseCase().deleteJob(_Id);
    if (!item) {
      AlertComponent("error", "Ocurrio un error al guardar los cambios.");
    }
  };

  const deleteExpiredJobs = async () => {
    const item = await new JobsUseCase().deleteExpiredJobs();
    if (!item) {
      AlertComponent("error", "Ocurrio un error al guardar los cambios.");
    }
  };

  //=======================================================================
  // UPDATE
  //=======================================================================

  const updateItemAttribute = async (
    _Id: string,
    key: keyof IJobs.NsJobOffer,
    e: any
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._Id === _Id ? { ...item, [key]: e.target.value } : item
      )
    );

    const item = await new JobsUseCase().updateJob(_Id, {
      state: e.target.value,
    });
    if (!item) {
      AlertComponent("error", "Ocurrio un error al guardar los cambios.");
    }
  };

  useEffect(() => {
    LoadInDataTable(items);
  }, [items]);

  //=======================================================================
  // SAVE
  //=======================================================================

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

  //=======================================================================
  // FILTER
  //=======================================================================

  const filterJobOffers = (
    jobs: IJobs.NsJobOffer[],
    minSalary?: string,
    onlyToday?: boolean
  ): IJobs.NsJobOffer[] => {
    return jobs
      .filter((job) => {
        const salary = parseInt(
          (job?.salary ?? "0")
            .replace(/[^\d.]/g, "")
            .replace(".", "")
            .replace(",", ""),
          10
        );
        const min = minSalary !== "" ? parseFloat(minSalary ?? "0") : 0;
        return salary >= min;
      })
      .filter((job) => {
        return onlyToday ? isToday(parseISO(job.deadline?.trim() || "")) : true;
      })
      .filter((job) => {
        return postulate ? job.state === 3 : true;
      });
  };

  useEffect(() => {
    if (items.length > 0) {
      const updatedJobs = filterJobOffers(items, minSalary, onlyToday);
      LoadInDataTable(updatedJobs);
    }
  }, [items, minSalary, onlyToday, postulate]);

  //=======================================================================
  // CARGAR DATA TABLE INICIAL
  //=======================================================================

  const LoadInDataTable = async (items: Array<IJobs.NsJobOffer>) => {
    const rows: Array<TablaJobsEntity> = [];
    items?.forEach((Y: IJobs.NsJobOffer) => {
      rows.push({
        Actions: (
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
              onClick={() => deleteItem(Y._Id ?? "")}
            >
              <DeleteIcon />
            </div>
          </div>
        ),
        company: Y?.company,
        description:
          Y?.location +
          ": " +
          Y?.positions +
          " \n " +
          Y?.contractType +
          " \n\n " +
          Y?.education,
        salary: Y?.salary,
        date: Y?.deadline ?? "",
        deadline: format(
          parse(Y?.deadline ?? "", "dd/MM/yyyy", new Date()),
          "yyyy/MM/dd"
        ),
        link: Y?.link,
        state: (
          <FormControl sx={{ width: "100px" }} variant="standard">
            <InputLabel htmlFor="Gender">Estado</InputLabel>
            <Select
              fullWidth
              id="Gender"
              name="Gender"
              value={Y.state}
              onChange={(e) => {
                updateItemAttribute(Y._Id ?? "", "state", e);
              }}
            >
              <MenuItem value={0}>Disable</MenuItem>
              <MenuItem value={1}>Enable</MenuItem>
              <MenuItem value={2}>Active</MenuItem>
              <MenuItem value={3}>Postulated</MenuItem>
              <MenuItem value={4}>Closed</MenuItem>
            </Select>
          </FormControl>
        ),
      });
    });

    setRowsDatatable(rows);
  };

  const Load = async () => {
    try {
      const jobs = await new JobsUseCase().Get();
      setItems(jobs);
      LoadInDataTable(jobs);
    } catch (error: any) {
      AlertComponent("error", error.message);
    }
  };

  useEffect(() => {
    if (rowsDataTable.length === 0) {
      Load();
    }
  }, []);

  return (
    <Box>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          variant="contained"
          color="inherit"
          fullWidth
          sx={{ mb: 3 }}
          onClick={() => {
            setOpen(true);
          }}
        >
          INPORT DATA
        </Button>

        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Salario Mínimo"
            variant="outlined"
            size="small"
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOnlyToday(!onlyToday)}
            sx={{ height: "38px" }}
          >
            {onlyToday ? "All" : "ONLY TODAY"}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => setPostulate(!postulate)}
            sx={{ height: "38px" }}
          >
            {postulate ? "All" : "POSTULATED"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={async () => {
              await deleteExpiredJobs();
              await Load();
            }}
            sx={{ height: "38px" }}
          >
            CLEAN EXPIRED
          </Button>
        </Stack>

        <TableJobs dataRows={rowsDataTable} />

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

const TableJobs = ({ dataRows }: { dataRows: Array<TablaJobsEntity> }) => {
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
      name: "ESTADO",
      idName: "state",
      selector: (row: TablaJobsEntity) => row?.state,
      cell: (row: TablaJobsEntity) => (
        <div style={{ margin: "auto", textAlign: "center" }}>{row?.state}</div>
      ),
      sortable: true,
      width: "110px",
    },
    {
      name: "FECHA",
      idName: "deadline",
      selector: (row: TablaJobsEntity) => row?.date,
      cell: (row: TablaJobsEntity) => <>{row?.date}</>,
      sortable: true,
      width: "100px",
    },
    {
      name: "SALARY",
      idName: "salary",
      selector: (row: TablaJobsEntity) => row?.salary,
      cell: (row: TablaJobsEntity) => <>{row?.salary}</>,
      // sortable: true,
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

  return <GenDataTable columns={columns} data={dataRows} rows={1000} />;
};

export default JobsIndex;
