import { LOAD,SETCONFIG } from './actionTypeStrings';
import { BASE_URL } from '../assets/baseURL'

const mapDispatchToProps = dispatch => {
  return {

    setConfig:(config)=>{
      // console.log("setConfig",config);
      dispatch({
        type: SETCONFIG,
        payload: config
      })
    },
    loadToDoList: ()=>{
      // console.log("loadToDoList");
      dispatch(()=>{
          // asynchrone Aktion
          const xhr = new XMLHttpRequest();
          let toDoJson = JSON.stringify({ action: "LOAD"  });
          // console.log("loadToDoList - toDoJson",toDoJson);
          let url=`${BASE_URL}/toDoData.php`;
          xhr.onload = function () {
            if (xhr.status != 200) return;
            // console.log("Empfangene Daten: ", xhr.responseText);
            const toDoData = JSON.parse(xhr.responseText);
            // console.log("toDoData",toDoData);
            dispatch({
              type: LOAD,
              payload: toDoData
            });
          };
          xhr.open("POST", url, true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(toDoJson);
      })
    },
    addToDo: (toDo) => {
      const toDoJson = JSON.stringify({ action: "ADD", toDo: toDo });
      const url = `${BASE_URL}/toDoData.php`;
    
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: toDoJson,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Hier kannst du weitere Aktionen ausführen, wenn das Hinzufügen erfolgreich war
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
        throw error; // Fehler weitergeben, damit sie auch im Aufrufer behandelt werden können
      });
    },
    updateToDoTable:(toDo)=>{
      // console.log("updateToDoTable",toDo);
      dispatch(()=>{
        const xhr = new XMLHttpRequest();
        let toDoJson = JSON.stringify({ action: "LOADCUSTOM", toDo: toDo });
        // console.log("toDoJson",toDoJson);
        let url=`${BASE_URL}/toDoData.php`;

        xhr.onload = function () {
          if (xhr.status != 200) return;
          // console.log("Empfangene Daten: ", xhr.responseText);
          const toDoData = JSON.parse(xhr.responseText);
          // console.log("toDoData",toDoData);
          dispatch({
            type: LOAD,
            payload: toDoData
          });

        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(toDoJson);
      })
    },
    deleteToDo:(toDo)=>{
      // console.log("deleteToDo",toDo);
      let toDoJson = JSON.stringify({ action: "DEL", toDo: toDo });
      let url = `${BASE_URL}/toDoData.php`;

      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: toDoJson
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(toDoData => {
        // console.log("toDoData",toDoData); // Rückantwort vom Server mit der message
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
      });
    },
    editToDo: (toDo) => {
      const toDoJson = JSON.stringify({ action: "EDIT", toDo: toDo });
      const url = `${BASE_URL}/toDoData.php`;
    
      return fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: toDoJson,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Hier kannst du weitere Aktionen ausführen, wenn das Hinzufügen erfolgreich war
      })
      .catch(error => {
        console.error("There was a problem with the fetch operation:", error);
        throw error; // Fehler weitergeben, damit sie auch im Aufrufer behandelt werden können
      });
    }

  };
};

export default mapDispatchToProps;
