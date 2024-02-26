import Reac,{ useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mapStateToProps from '../redux/mapStateToProps';
import mapDispatchToProps from '../redux/mapDispatchToProps';
import Table from './Table';

function Main(props) {
    // console.log("Main",props);

    // Daten aus dem Formular
    const [toDoFormular, setToDoFormular] = useState({
        toDoListIdForm:null,
        toDoListNameForm:"",
        toDoListStatusForm:0,
        toDoListDateForm:""
    })
    const [modus, setModus] = useState("Speichern")

    // Formularwerte aus den Inputfeldern setzen
    function handleInputName(e){     
        // console.log(e.target.name);
        setToDoFormular({
            ...toDoFormular,
            [e.target.name]: e.target.value
        })
        // console.log(toDoFormular);
    }

    //Speichern / Hinzufügen der Formularwerte in die Datenbank
    function addToDo(e){
        e.preventDefault();
        // console.log(toDoFormular);

        // Eintrag hinzufügen
        if(modus === "Speichern"){
            console.log("addToDo-Speichern",e,toDoFormular);
            let toDoData = {
                toDo: {
                    // Anpassen der Eigenschaften entsprechend der Datenstruktur
                    toDoListId: toDoFormular.toDoListIdForm,
                    toDoListName: toDoFormular.toDoListNameForm,
                    toDoListStatus: toDoFormular.toDoListStatusForm,
                    toDoListDate: toDoFormular.toDoListDateForm
                }
            };
            props.addToDo(toDoData)
            .then(()=>{
                updateTableView();
            });
            // Formular leeren
            clearInputField()
        }// Eintrag hinzufügen END

        // Eintrag bearbeiten
        if(modus === "Update"){
            // console.log("addToDo-Update",e,toDoFormular);
            let toDoData = {
                toDo: {
                    // Anpassen der Eigenschaften entsprechend der Datenstruktur
                    toDoListId: toDoFormular.toDoListIdForm,
                    toDoListName: toDoFormular.toDoListNameForm,
                    toDoListStatus: toDoFormular.toDoListStatusForm,
                    toDoListDate: toDoFormular.toDoListDateForm
                }
            };
            props.editToDo(toDoData)
            .then(()=>{
                updateTableView();
            });
            clearInputField()
        }// Eintrag bearbeiten END
    }

    // Aufgabe zum bearbeiten in das Formular laden und Buttonbeschriftung anpassen 
    function editToDoItem(item){
        // console.log("editToDoItem",item);
        setToDoFormular({        
            toDoListIdForm:     item.toDoListId,
            toDoListNameForm:   item.toDoListName,
            toDoListStatusForm: item.toDoListStatus,
            toDoListDateForm:   item.toDoListDate
        })
        setModus("Update")
    }

    // Formularfelder leeren
    function clearInputField(){
        // console.log("clearInputField");
        setToDoFormular({        
            toDoListIdForm:null,
            toDoListNameForm:"",
            toDoListStatusForm:0,
            toDoListDateForm:""
        })
        setModus("Speichern")
    }

    // Ansicht der Tabelle ändern (Anzahl an Reihen und Startpunkt)
    function updateTable(e){
        // console.log("updateTable-Name",e.target.name);
        // console.log("updateTable-Value",e.target.value);
        props.setConfig({
            [e.target.name]: e.target.value
        })
        updateTableView()
    }

    // Tabelle neu aus Datenbank laden
    function updateTableView(){
        // console.log("updateTableView");
        const toDoData = {
            toDo: { ...props.tableConfig
            }
        }
        // console.log("useEffect - toDoData",toDoData)
        props.updateToDoTable(toDoData);
    }


    useEffect(()=>{
        // console.log("useEffect - props.tableConfig",props.tableConfig)
        updateTableView()
      },[props.tableConfig])

    
    return (
        <div className='container-main'>
            <h1>To Do Liste</h1>
            <div className="todo-container">
                <h2>Aufgabe oder Termin hinzufügen</h2>
                <form className="formular" onSubmit={(e)=>{addToDo(e)}}>
                    <input type='hidden' value={toDoFormular.toDoListIdForm}/>
                    <input className='inputfield' required type="text" placeholder="Bitte Aufgabe hier eintragen" name="toDoListNameForm" value={toDoFormular.toDoListNameForm} onChange={(e)=>{handleInputName(e)}}/>
                    <input className='inputfield' type="number" min="0" max="100" placeholder='0' name="toDoListStatusForm" value={toDoFormular.toDoListStatusForm} onChange={(e)=>{handleInputName(e)}}/>
                    <input className='inputfield' type="datetime-local"  name="toDoListDateForm" value={toDoFormular.toDoListDateForm} onChange={(e)=>{handleInputName(e)}}/>
                    <button disabled={!toDoFormular.toDoListNameForm} >{modus}</button>                    
                </form>
                    <div>
                        <button disabled={!toDoFormular.toDoListNameForm} onClick={clearInputField}>Felder leeren</button>  
                    </div>   
                    <div>
                        <label>Reihen: </label>
                        <input className='inputfieldnumber' type="number" min="2" max="20"  name="limit" value={props.tableConfig.limit} onChange={(e)=>{updateTable(e)}}/>
                    </div>           
                    <div>
                        <label>Start: </label>
                        <input className='inputfieldnumber' type="number" min="0"   name="offset" value={props.tableConfig.offset} onChange={(e)=>{updateTable(e)}}/>
                    </div>
                    
                
            </div> 
            {props.toDoList.length > 0 &&
            <>

                <div className='table-container'>
                <h2>Übersicht</h2>
                    <Table updateTableView={updateTableView} editToDoItem={editToDoItem}/>
                </div>  
            </>
            }                  
            
        </div>
    );
}

export default connect(mapStateToProps,mapDispatchToProps) (Main);