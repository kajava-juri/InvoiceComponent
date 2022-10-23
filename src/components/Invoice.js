import React, { useEffect, useState } from 'react';
import '../assets/Styles/invoice.css'
import _ from "lodash";

export default function Invoice(){
    let [clientName, setClientName] = useState("");
    let [totalSum, setTotalSum] = useState(0);
    let [nameError , setNameError] = useState("");

    let invoiceLine = {
        id: 1,
        description: "",
        quantity: 1,
        price: 0.00,
        errors: {
            description: "",
            quantity: "",
            price: "",
            total: ""
        },
        total: function(){
            return this.quantity * this.price;
        }
    }
    
    let [invoiceLines, setinvoiceLines] = useState([]);

    const current = new Date();
    const dueDate = new Date();
    current.setDate(current.getDate());
    dueDate.setDate(current.getDate() + 7);
    const currentDateString = current.toISOString().substring(0, 10);

    let [dueDateString, setdueDateString] = useState(dueDate.toISOString().substring(0, 10));

    function handleDateChange(event){
        let curr = new Date(Date.parse(event.target.value));
        curr.setDate(curr.getDate() + 7);
        setdueDateString(curr.toISOString().substring(0, 10));
    }

    function handleNameChange(event){
        setClientName(event.target.value);
    }

    function handleLineChange(event){
        let id = event.target.parentElement.parentElement.getAttribute("lineid");
        id = parseInt(id);
        const { name, value } = event.target;

        setinvoiceLines(invoiceLines.map(line => {
            //loop through objects
            if (line.id === id){
                //create a copy of the object using '...' syntax that matched the id and updated the specified property
                return {...line, [name]: value};

            } else {
                return line;
            }
        }));
        
    }

    function handleCreateLine(){
        setinvoiceLines([...invoiceLines, {...invoiceLine, id: invoiceLines.length + 1}]);
    }

    function handleDeleteLine(event){
        let id = event.target.parentElement.parentElement.getAttribute("lineid");
        id = parseInt(id);
        setinvoiceLines(invoiceLines.filter(l => l.id !== id));
    }

    function calculateTotalSum(){
        let sum = 0;
        invoiceLines.forEach(line => {
            sum += line.total();
        });
        setTotalSum(sum);
    }

    useEffect(() => {
        calculateTotalSum();
    }, [invoiceLines])

    function handleSubmit(event){
        let invoiceValid = true;
        if(clientName.length > 32){
            setNameError("Nimi peab olema vähem kui 32 tähemärki");
            invoiceValid = false;
        } else {
            setNameError("");
        }
        let updatedInvoiceLines = _.cloneDeep(invoiceLines);
        updatedInvoiceLines.forEach(line => {
            if(line.description.length > 32){
                line.errors.description = "Kirjeldus peab olema vähem kui 32 tähemärki";
            } else {
                line.errors.description = "";
            }
            if(line.price.length > 8){
                line.errors.price = "Hind peab olema vähem kui 8 tähemärki";
            } else {
                line.errors.price = "";
            }
            if(line.quantity.length > 8){
                line.errors.quantity = "Kogus peab olema vähem kui 8 tähemärki";
            } else {
                line.errors.quantity = "";
            }
            if(line.total().toString().length > 8){
                line.errors.total = "Summa peab olema vähem kui 8 tähemärki";
            } else {
                line.errors.total = "";
            }
            let valid = Object.values(line.errors).every(l => l === "");
            if(!valid && invoiceValid === true){
                invoiceValid = false;
            }

        });
        console.log(updatedInvoiceLines);

        //make a modal to display invalid fields

        setinvoiceLines(updatedInvoiceLines);

        if(invoiceValid){
            alert("Salvestamine õnnestus");
        } else {
            alert("Palun uuenda veateatega märgitud väljad");
        }


        //console.log(invoiceLinerrors);
    }

    return (
        <div className='main'>
            <div className='header'>
                <h2 style={{fontSize: 32}}>Arve</h2>
                <div style={{width: "100%"}}>
                    <h3>Klient</h3>
                    <hr/>

                    <div className='headerInputGroup'>
                        <label htmlFor='name'>Nimi</label>
                        <input type={"text"} id="name" className='headerInput' name='clientName' onChange={handleNameChange} value={clientName} ></input>
                        <span className='errorMessage'>{nameError}</span>
                    </div>

                    <label htmlFor='date'>Kuupäev</label>
                    <input type={"date"} id="date" className='headerInput' defaultValue={currentDateString} onChange={handleDateChange}></input>

                    <label htmlFor='dueDate'>Maksetähtpäev</label>
                    <input id='dueDate' type={"date"} className='headerInput' readOnly={true} value={dueDateString}></input>
                </div>
            </div>
            <div className='container'>
                <h3>Arveread</h3>
                <hr style={{width: "100%"}}/>
                <button onClick={handleCreateLine}>+</button>
                <div className='row'>
                    <div className='col-md-1'></div>
                    <div className='col-md-5'>Kirjeldus</div>
                    <div className='col-md-2'>Hind</div>
                    <div className='col-md-2'>Kogus</div>
                    <div className='col-md-2'>Summa</div>
                </div>
                {invoiceLines && invoiceLines.map((line, i) => {
                        return (
                            <div key={i} lineid={line.id} className='row'>
                                <div className='col-md-1 p-0'>
                                    <button style={{width: "100%"}} onClick={handleDeleteLine}>-</button>
                                </div>
                                <div className='col-md-5 p-0'>
                                    <input type={"text"}  name='description' value={line.description} onChange={handleLineChange} style={{width: "100%"}}></input>
                                    <p className='errorMessage'>{line.errors.description}</p>
                                </div>
                                <div className='col-md-2 p-0'>
                                    <input type={"number"}  name='price' value={line.price} onChange={handleLineChange} style={{width: "100%"}}></input>
                                    <p className='errorMessage'>{line.errors.price}</p>
                                </div>
                                <div className='col-md-2 p-0'>
                                    <input type={"number"}  name='quantity' value={line.quantity} onChange={handleLineChange} style={{width: "100%"}}></input>
                                    <p className='errorMessage'>{line.errors.quantity}</p>
                                </div>
                                <div className='col-md-2 p-0'>
                                    <p style={{width: "100%"}}>{line.total()}</p>
                                    <p className='errorMessage'>{line.errors.total}</p>
                                </div>
                            </div>
                        )
                    })}
            </div>
            <div className='invoiceFooter'>
                <p style={{alignSelf: "flex-start"}}>{totalSum}</p>
                <button style={{width: 100, height: 50, marginLeft: 32}} onClick={handleSubmit}>Salvesta</button>
            </div>
        </div>
    )
}

