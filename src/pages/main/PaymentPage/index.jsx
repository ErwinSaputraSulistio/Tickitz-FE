import './style.css'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import axios from 'axios'
import Swal from 'sweetalert2'

export default function PaymentPage(){
   const [buyerData, useBuyerData] = useState({
      buyerName: null,
      buyerEmail: null,
      buyerPhoneNumber: null,
      paymentMethod: null
   })
   const dispatch = useDispatch()
   const paramsId = useParams().id
   const {transactionId} = useSelector(state => state.transaction)
   const getTransactionById = () => {
      axios.get(process.env.REACT_APP_TRANSACTION + "number/" + paramsId)
      .then((res) => { 
         dispatch({type: "TRANSACTION_ID", payload: res.data.outputData[0]})
         useBuyerData({buyerName: res.data.outputData[0].ticketBuyer, buyerEmail: res.data.outputData[0].buyerEmail, buyerPhoneNumber: res.data.outputData[0].phoneNumber})
      })
      .catch((err) => {
         // window.location = "/profile-page/" + localStorage.getItem("userId")
      })
   }
   const setPaymentMethod = (e) => { useBuyerData({...buyerData, paymentMethod: e.target.getAttribute("payment")}) }
   const changeBuyerInput = (e) => { useBuyerData({...buyerData, [e.target.name] : e.target.value}) }
   const verifyPayment = () => {
      const packedData = {...buyerData}
      if(packedData.paymentMethod === undefined) { Swal.fire("Error!", "Tolong pilih metode pembayaran terlebih dahulu, yah ~", "error") }
      else if(packedData.buyerName === "" || packedData.buyerEmail === "" || packedData.buyerPhoneNumber === "") { Swal.fire("Error!", "Tolong pastikan semua informasi personal sudah terisi yah ~", "error") }
      else {
         axios.put(process.env.REACT_APP_TRANSACTION + "verify/" + paramsId, packedData, {
            headers: { authorization: 'Bearer ' + localStorage.getItem("jwtToken") }
         })
         .then(() => { Swal.fire("Berhasil!", "Pembayaran kamu sudah kami terima, tiket berhasil di verifikasi!", "success").then(() => {window.location = "/home-page"}) })
         .catch((err) => { Swal.fire("Login ulang, yuk?!", err.response.data.jwtError, "warning").then(() => {window.location = "/login"}) })
      }
   }
   useEffect(() => { getTransactionById() }, [])
   return(
      <div className="showInAnimation">
         <Helmet>
            <title>Tickitz - Payment Page</title>
         </Helmet>
         <Navbar/>
         <div className="mulish paymentPage">
            <div className="leftPaymentPage">
               <p className="noMargin paymentPageTitle">Payment Info</p>
               <div className="insidePaymentPageWhite" style={{padding: "1vw 2vw"}}>
                  <div className="insidePaymentPageWhiteAgain">
                     <p className="color6B6B6B noMargin">Date &amp; time</p>
                     <p className="noMargin">{transactionId.showDate + " at " + transactionId.startTime}</p>
                  </div>
                  <div className="insidePaymentPageWhiteAgain">
                     <p className="color6B6B6B noMargin">Movie title</p>
                     <p className="noMargin">{transactionId.choosenMovie}</p>
                  </div>
                  <div className="insidePaymentPageWhiteAgain">
                     <p className="color6B6B6B noMargin">Cinema name</p>
                     <p className="noMargin">{transactionId.cinemaName}</p>
                  </div>
                  <div className="insidePaymentPageWhiteAgain">
                     <p className="color6B6B6B noMargin">Number of tickets</p>
                     <p className="noMargin">{transactionId.howManyTickets + " pieces"}</p>
                  </div>
                  <div className="insidePaymentPageWhiteAgain" style={{border: "none"}}>
                     <p className="color6B6B6B noMargin">Total payment</p>
                     <p className="noMargin">{"IDR " + transactionId.totalPayment}</p>
                  </div>
               </div>
               <p className="noMargin paymentPageTitle">Choose a payment method</p>
               <div className="insidePaymentPageWhite">
                  <div className="choosePaymentMethodRow" style={{marginBottom: "2vw"}}>
                     <div className="paymentMethodBtn" onClick={(e) => {setPaymentMethod(e)}}><img className="paymentMethodImg" payment="Google Pay" src="https://user-images.githubusercontent.com/77045083/113516435-7c72b700-95a4-11eb-972a-51f5ac1c3e24.png"/></div>
                     <div className="paymentMethodBtn" onClick={(e) => {setPaymentMethod(e)}}><img className="paymentMethodImg" payment="Visa" src="https://user-images.githubusercontent.com/77045083/113516439-7e3c7a80-95a4-11eb-8752-1216dd8fa7b2.png"/></div>
                     <div className="paymentMethodBtn" onClick={(e) => {setPaymentMethod(e)}}><img className="paymentMethodImg" payment="GO-Pay" src="https://user-images.githubusercontent.com/77045083/113516433-7bda2080-95a4-11eb-8397-ea81da151101.png"/></div>
                     <div className="paymentMethodBtn" onClick={(e) => {setPaymentMethod(e)}}><img className="paymentMethodImg" payment="Paypal" src="https://user-images.githubusercontent.com/77045083/113516438-7da3e400-95a4-11eb-8c5f-a52d747be3ba.png"/></div>
                  </div>
                  <div className="choosePaymentMethodRow">
                     <div className="paymentMethodBtn" onClick={(e) => {setPaymentMethod(e)}}><img className="paymentMethodImg" payment="Dana" src="https://user-images.githubusercontent.com/77045083/113516431-7b418a00-95a4-11eb-9566-1c295678d300.png"/></div>
                     <div className="paymentMethodBtn" onClick={(e) => {setPaymentMethod(e)}}><img className="paymentMethodImg" payment="BCA" src="https://user-images.githubusercontent.com/77045083/113516429-7977c680-95a4-11eb-922a-5d85393d2958.png"/></div>
                     <div className="paymentMethodBtn" onClick={(e) => {setPaymentMethod(e)}}><img className="paymentMethodImg" payment="BRI" src="https://user-images.githubusercontent.com/77045083/113516430-7aa8f380-95a4-11eb-9a76-4cdc621c0783.png"/></div>
                     <div className="paymentMethodBtn" onClick={(e) => {setPaymentMethod(e)}}><img className="paymentMethodImg" payment="OVO" src="https://user-images.githubusercontent.com/77045083/113516436-7d0b4d80-95a4-11eb-8bbe-d9430506398c.png"/></div>
                  </div>
               </div>
               <div className="payYourOrderZone"><Link className="payYourOrderBtn" onClick={() => {verifyPayment()}}>Pay your order</Link></div>
            </div>
            <div className="rightPaymentPage">
               <p className="noMargin paymentPageTitle">Personal Info</p>
               <div className="insidePaymentPageWhite">
                  <p className="noMargin paymentPageInputLabel">Full Name</p>
                  <input className="paymentPageInput" name="buyerName" onChange={changeBuyerInput} placeholder="Nama pembeli tiket" type="text" value={buyerData.buyerName}/>
                  <p className="noMargin paymentPageInputLabel">Email</p>
                  <input className="paymentPageInput" name="buyerEmail" onChange={changeBuyerInput} placeholder="Email pembeli tiket" type="email" value={buyerData.buyerEmail}/>
                  <p className="noMargin paymentPageInputLabel">Phone Number</p>
                  <input className="paymentPageInput" name="buyerPhoneNumber" onChange={changeBuyerInput} placeholder="Nomor telepon pembeli tiket" type="number" value={buyerData.buyerPhoneNumber}/>
               </div>
            </div>
         </div>
         <Footer/>
         {localStorage.getItem("isLoggedIn") !== "true" ? window.location = "/login" : null}
      </div>
   )
}