import React, { useEffect, useState } from 'react';
import '../assets/Styles/invoice.css'

export default function Invoice(){
    let [clientName, setClientName] = useState("");
    let [totalSum, setTotalSum] = useState(0);
    let [invoiceErrors, setInvoiceErrors] = useState({
        clientName: "",
        invoiceLines: []
    });

    let invoiceLine = {
        id: 1,
        description: "",
        quantity: 1,
        price: 0.00,
        error: "",
        total: function(){
            return this.quantity * this.price;
        }
    }
    
    let [invoiceLines, setinvoiceLines] = useState([{...invoiceLine, id: 1}]);

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
        let nameError = "";
        if(clientName.length > 32){
            nameError = "Name must be less than 32 characters";
        }
        let invoiceLinerrors = [];
        invoiceLines.forEach(line => {
            let lineErrors = {};
            if(line.description.length > 32){
                lineErrors.description = "Description must be less than 32 characters";
            }
            if(line.price.length > 8){
                lineErrors.price = "Price must be less than 8 digits";
            }
            if(line.quantity.length > 8){
                lineErrors.quantity = "Quantity must be less than 8 digits";
            }
            if(line.total().length > 8){
                lineErrors.total = "Total must be less than 8 digits";
            }
            let invalid = Object.keys(lineErrors).length === 0;
            if(!invalid){
                invoiceLinerrors.push(lineErrors);
            }

        });
        console.log(invoiceLinerrors.length);

        //make a modal to display invalid fields
        setInvoiceErrors({clientName: nameError, invoiceLines: invoiceLinerrors});
        //console.log(invoiceLinerrors);
    }

    return (
        <div className='main'>
            <div className='header'>
                <h2 style={{fontSize: 32}}>Invoice</h2>
                <div style={{width: "100%"}}>
                    <h3>Client</h3>
                    <hr/>

                    <div className='headerInputGroup'>
                        <label htmlFor='name'>Name</label>
                        <input type={"text"} id="name" className='headerInput' name='clientName' onChange={handleNameChange} value={clientName} ></input>
                        <span className='errorMessage'>{invoiceErrors.clientName}</span>
                    </div>

                    <label htmlFor='date'>Date</label>
                    <input type={"date"} id="date" className='headerInput' defaultValue={currentDateString} onChange={handleDateChange}></input>

                    <label htmlFor='dueDate'>Payment due date</label>
                    <input id='dueDate' type={"date"} className='headerInput' readOnly={true} value={dueDateString}></input>
                </div>
            </div>
            <div className='container'>
                <h3>Invoice lines</h3>
                <hr style={{width: "100%"}}/>
                <button onClick={handleCreateLine}>+</button>
                <div className='row'>
                    <div className='col-md-1'></div>
                    <div className='col-md-5'>Description</div>
                    <div className='col-md-2'>Price</div>
                    <div className='col-md-2'>Quantity</div>
                    <div className='col-md-2'>Total</div>
                </div>
                {invoiceLines && invoiceLines.map((line, i) => {
                        return (
                            <div key={i} lineid={line.id} className='row'>
                                <div className='col-md-1 p-0'>
                                    <button style={{width: "100%"}} onClick={handleDeleteLine}>-</button>
                                </div>
                                <div className='col-md-5 p-0'>
                                    <input type={"text"}  name='description' value={line.description} onChange={handleLineChange} style={{width: "100%"}}></input>
                                </div>
                                <div className='col-md-2 p-0'>
                                    <input type={"number"}  name='price' value={line.price} onChange={handleLineChange} style={{width: "100%"}}></input>
                                    <p>terst</p>
                                </div>
                                <div className='col-md-2 p-0'>
                                    <input type={"number"}  name='quantity' value={line.quantity} onChange={handleLineChange} style={{width: "100%"}}></input>
                                    <p>terst</p>
                                </div>
                                <div className='col-md-2 p-0'>
                                    <p style={{width: "100%"}}>{line.total()}</p>
                                    <p>terst</p>
                                </div>
                            </div>
                        )
                    })}
            </div>
            <div className='invoiceFooter'>
                <p style={{alignSelf: "flex-start"}}>{totalSum}</p>
                <button style={{width: 100, height: 50, marginLeft: 32}} onClick={handleSubmit}>Save</button>
            </div>
        </div>
    )
}

