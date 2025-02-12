import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid2";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useGlobalContext } from "../../../Global";
import { TextField, FormControl } from "@mui/material";
import { TableStyles } from "react-data-table-component";

const lightStyles: TableStyles = {
  rows: {
    style: {
      minHeight: "50px",
    },
  },
  headCells: {
    style: {
      padding: "5px",
      backgroundColor: "#0074C5",
      color: "#FFFFFF",
      textTransform: "uppercase",
      fontWeight: "bold",
      fontSize: "14px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
      fontSize: "14px",
      userSelect: "text",
    },
  },
};

const darkStyles: TableStyles = {
  rows: {
    style: {
      minHeight: "50px",
    },
  },
  noData: {
    style: {
      backgroundColor: "#00072E",
      color: "#FFFFFF",
    },
  },
  table: {
    style: {
      borderRadius: "10px",
    },
  },
  headCells: {
    style: {
      padding: "5px",
      backgroundColor: "#000000",
      color: "#FFFFFF",
      textTransform: "uppercase",
      fontWeight: "bold",
      fontSize: "14px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
      fontSize: "14px",
      backgroundColor: "#00072E",
      color: "#FFFFFF",
      userSelect: "text",
    },
  },
};

export default function GenDataTable(Props: any) {
  const [TotalPages, setTotalPages] = useState(1);
  const [Buscador, setBuscador] = useState("");
  const [DataTableLocal, setDataTableLocal] = useState([]);
  const [DataTableLPag, setDataTableLPag] = useState([]);
  const [lote, setLote] = useState(10);

  const { state } = useGlobalContext();
  const [customStyles, setCustomStyles] = useState<TableStyles>(
    state?.mode === "dark" ? darkStyles : lightStyles
  );

  useEffect(() => {
    setCustomStyles(state?.mode === "dark" ? darkStyles : lightStyles);
  }, [state]);

  const handleChange = (event: any) => {
    setLote(event.target.value);
  };

  useEffect(() => {
    setDataTableLocal(Props.data);
  }, [Props.data]);

  useEffect(() => {
    setLote(Props?.rows ?? 10);
  }, [Props?.rows]);

  const BuscarElemento = (e: any) => {
    e.preventDefault();
    setBuscador(e.target.value);
    const filtered = Props.data.filter(function (element: any) {
      let CopyObjetc = Object.assign({}, element);
      Props.columns.forEach((element: any) => {
        if (typeof CopyObjetc[element?.idName] === "object") {
          CopyObjetc[element?.idName] = "";
        }
      });
      let MyLinealElement = JSON.stringify(CopyObjetc)
        .replaceAll(/['"]+/g, "")
        .replaceAll(":", " ")
        .replaceAll("{", ",")
        .replaceAll("}", "");
      Props.columns.forEach((element: any) => {
        MyLinealElement = MyLinealElement.replaceAll("," + element?.idName, "");
      });
      if (MyLinealElement.match(new RegExp(`${e.target.value}.*`, "i"))) {
        return element;
      }
    });
    setDataTableLocal(filtered);
  };

  const ChangePage = (e: any) => {
    let DataView = DataTableLocal.slice((e - 1) * lote, (e - 1) * lote + lote);
    setDataTableLPag(DataView);
  };

  useEffect(() => {
    let DivPages = DataTableLocal.length / lote;
    let RoundPage = Math.round(DivPages);

    if (RoundPage - DivPages < 0) {
      RoundPage = RoundPage + 1;
    }
    setTotalPages(RoundPage);
    setDataTableLPag(DataTableLocal?.slice(0, lote));
  }, [DataTableLocal, lote]);

  return (
    <>
      <Grid
        container
        spacing={0.5}
        sx={{ marginBottom: "8px", marginTop: "8px" }}
      >
        <Grid size={{ xs: 12, md: 9, lg: 10 }}>
          <TextField
            label="Buscar"
            variant="outlined"
            size="small"
            fullWidth
            value={Buscador}
            onChange={BuscarElemento}
            sx={{ margin: "0px" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3, lg: 2 }}>
          <FormControl fullWidth size="small" sx={{ margin: "0px" }}>
            <Select value={lote} onChange={handleChange}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={500}>500</MenuItem>
              <MenuItem value={1000}>1000</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <div style={{ borderRadius: "8px" }}>
        <DataTable
          className="justify-center"
          columns={Props?.columns}
          data={DataTableLPag}
          customStyles={customStyles}
          responsive
          // pagination
          persistTableHead
          noDataComponent={
            <span style={{ padding: "30px" }}>
              No se han encontrado resultados...
            </span>
          }
          fixedHeader
          //progressPending={pending}
          //selectableRows
        />
      </div>

      <Stack
        spacing={2}
        style={{
          alignItems: "center",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <Pagination
          count={TotalPages}
          onChange={(event, value) => ChangePage(value)}
          siblingCount={0}
          color="primary"
        />
      </Stack>
    </>
  );
}
