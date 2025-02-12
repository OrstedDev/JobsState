import { useState, useEffect, useRef } from "react";
import { styled, alpha } from "@mui/material/styles";
import { Link } from "react-router-dom";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import { RoutesUser } from "../../../DataLayer/UseCases/Initialize/InitData";

export const SearchDashBoard = () => {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<
    Array<{ Name: string; Value: string; Route: string }>
  >([]);
  const [isVisible, setIsVisible] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const closeAnimate = () => {
    setIsVisible(false);
    setTimeout(() => {
      setQuery("");
      setFilteredResults([]);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        closeAnimate();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredResults([]);
      setIsVisible(false);
      return;
    }

    const filtered = RoutesUser.getAll().filter((item) =>
      item.Name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredResults(filtered);
    setIsVisible(true);
  };

  return (
    <div style={{ position: "relative" }} ref={searchRef}>
      <SearchStyle>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={query}
          onChange={handleSearch}
        />
      </SearchStyle>

      <div className={`dropdown ${isVisible ? "fade-in" : "fade-out"}`}>
        {filteredResults.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              width: "100%",
              zIndex: 2,
              marginTop: "10px",
              borderRadius: "4px",
            }}
          >
            <List>
              {filteredResults.map((item, index) => (
                <Link
                  key={index}
                  to={item.Route}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    paddingLeft: 10,
                    width: "100%",
                    height: "35px",
                  }}
                  onClick={closeAnimate}
                >
                  {item.Name}
                </Link>
              ))}
            </List>
          </Paper>
        )}
      </div>
    </div>
  );
};

// Estilos del buscador
const SearchStyle = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
  transition: theme.transitions.create("width"),
}));

// Animaciones CSS
const style = document.createElement("style");
style.innerHTML = `
  .fade-in {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  }

  .fade-out {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.2s ease-in, transform 0.2s ease-in;
  }
`;

document.head.appendChild(style);
