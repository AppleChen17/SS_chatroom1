import { styled } from "@mui/system";

const GlobalStyle = styled("div")({
  "*": {
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  body: {
    backgroundColor: "#e85e5ea6",
    color: "white",
    display: "flex",
    justifyContent: "center",
  },
});

const LoginArea = styled("div")({
  backgroundColor: "#433232a6",
  textAlign: "center",
  width: "600px",
  padding: "30px",
  borderRadius: "10px",
  marginTop: "100px",
});

const Button = styled("button")({
  display: "block",
  width: "100%",
  margin: "15px 0",
});

const Label = styled("label")({
  fontSize: "1.5rem",
  margin: "1rem 1rem",
});

export { GlobalStyle, LoginArea, Button, Label };