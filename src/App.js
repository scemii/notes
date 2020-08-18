import React, { useEffect, useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "./utils";
import { useForm } from "react-hook-form";
import uuid from "react-uuid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import "./App.css";
import trash from "./ressources/trash.svg";
import draw from "./ressources/draw.svg";

function App() {
  let dataLocal = localStorage.getItem("data");
  const date = new Date().toISOString().substring(0, 10);

  const [newData, setNewData] = useState([]);
  const [editView, setEditView] = useState(false);
  const [cardToEdit, setCardToEdit] = useState({});

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (dataForm, e) => {
    setEditView(false);
    let key = newData.length;
    let formatData = {
      id: key,
      Title: dataForm.Title,
      Content: dataForm.Content,
    };
    let actualData = [...newData];
    actualData.unshift(formatData);

    setNewData(actualData);
    saveToLocal(actualData);
    e.target.reset();
  };

  const saveToLocal = (data) => {
    localStorage.setItem("data", JSON.stringify(data));
  };

  const handleDelete = (index) => {
    setEditView(false);
    let filteredData = [...newData];
    filteredData.splice(index, 1);
    setNewData(filteredData);
    saveToLocal(filteredData);
    // console.log("delete", index);
    //   let filteredData = newData.filter((element) => {
    //     return element.key !== index;
    //   });
    //   setNewData(filteredData);
    //   console.log("element.index", index);
  };

  const handleEdit = async (index) => {
    await setCardToEdit(newData[index]);
    let filteredData = [...newData];
    filteredData.splice(index, 1);

    setNewData(filteredData);
    saveToLocal(filteredData);
    setEditView(true);
    // console.log("index", index);
    // console.log("newDataindex", newData[index]);
    // console.log("cardtoedit", cardToEdit);
  };

  useEffect(() => {
    async function fetchData() {
      //console.log("render");
      if (dataLocal) {
        setNewData(JSON.parse(dataLocal));
      } else {
        setNewData([]);
      }
    }

    fetchData();
  }, []);

  const renderEditView = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Title"
          name="Title"
          ref={register}
          defaultValue={cardToEdit.Title}
        />
        <input
          style={{ height: "300px" }}
          type="text"
          placeholder="Content"
          name="Content"
          ref={register}
          defaultValue={cardToEdit.Content}
        />

        <input type="submit" />
        {/* <p style={{ color: "red" }}>EDIT VIEW</p> */}
      </form>
    );
  };

  const renderDefaultView = (index) => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Title"
          name="Title"
          defaultValue=""
          ref={register}
        />
        <input
          style={{ height: "300px" }}
          type="text"
          placeholder="Content"
          name="Content"
          defaultValue=""
          ref={register}
        />
        <input type="submit" />
      </form>
    );
  };

  return newData?.length > 0 ? (
    <div className="App">
      {editView ? renderEditView() : renderDefaultView()}
      <Container
        onDrop={async (e) => {
          await setNewData(applyDrag(newData, e));
          await saveToLocal(newData);
          //console.log("updated");
        }}
      >
        {newData.map((content, index) => {
          return (
            <Draggable key={uuid()}>
              <Card
                style={{
                  minHeight: "200px",
                  width: "600px",
                  padding: "1em",
                  margin: "0 auto",
                  marginBottom: "1em",
                  backgroundColor: "#8DC6FF",
                  textAlign: "left",
                }}
              >
                <CardContent>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h3" component="h2">
                      {content.Title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {date}
                    </Typography>
                  </div>
                  <p style={{ paddingTop: "2em", paddingBottom: "2em" }}>
                    {content.Content}
                  </p>
                  <div style={{ display: "flex" }}>
                    <img
                      id="delete"
                      style={{ width: "30px" }}
                      src={trash}
                      alt="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete(index);
                      }}
                    />
                    <img
                      id="edit"
                      style={{ width: "30px", marginLeft: "1em" }}
                      src={draw}
                      alt="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleEdit(index);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Draggable>
          );
        })}
      </Container>
    </div>
  ) : (
    <div className="App">
      {editView ? renderEditView() : renderDefaultView()}
      <p style={{ minWidth: "632px", color: "white" }}>No data</p>
    </div>
  );
}

export default App;
