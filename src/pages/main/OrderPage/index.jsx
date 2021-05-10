import './style.css'
import { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import axios from 'axios'
import Swal from 'sweetalert2'

export default class OrderPage extends Component{
   constructor(){
      super()
      this.state = { 
         orderedMovie: [],
         orderedSeat: [],
         seatAlphabet: ["A","B","C","D","E","F","G"],
         seatNumber: [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
      }
   }
   componentDidMount(){
      const paramsId = this.props.match.params.id
      axios.get(process.env.REACT_APP_NOWSHOWING + paramsId, {
         headers: {authorization: 'Bearer ' + localStorage.getItem("jwtToken")}
      })
      .then((res) => {
         this.setState({orderedMovie: res.data.outputData[0]})
         if(this.state.orderedMovie.movieName === undefined){
         Swal.fire("Oops!", "Tiket film yang ingin dibeli tidak ditemukan, proses pembelian tiket gagal!", "error") 
         .then(() => {window.location = "/home-page"})
         }
      })
      .catch((err) => {console.log(err)})
   }
   // CHECK SEAT
   checkSeat = (e, seatPosition) => {
      const checkSlot = this.state.orderedSeat.filter(function(result) {return (result === seatPosition)})
      if(checkSlot.length >= 1) {
         e.target.classList.remove("selectedSeatActive")
         const removedResult = this.state.orderedSeat.filter(function(result) {return result !== seatPosition})
         this.setState({orderedSeat: removedResult})
      }
      else {
         e.target.classList.add("selectedSeatActive")
         this.setState({orderedSeat: [...this.state.orderedSeat, seatPosition]})
      }
   }
   // CHECKOUT NOW
   checkoutNow = () => {
      if(localStorage.getItem("isLoggedIn") === null){
         Swal.fire(
            "Login dulu yah ~",
            "Kalau ingin memesan tiket, harap login dengan akun kamu dulu yah ~",
            "error"
         ).then(() => {window.location = "/login"})
      }
      else if(this.state.orderedSeat.length === 0) {
         Swal.fire(
            "Pilih posisi kursi nya dong ~",
            "Mau duduk dimana nanti kalau gak milih posisi kursi nya? XD",
            "warning"
         )
      }
      else {
         const allSeatPosition = this.state.orderedSeat.sort((a,b) => a.localeCompare(b, 'en', { numeric: true })).join(", ")
         const totalTicketPrice = this.state.orderedMovie.ticketPrice * this.state.orderedSeat.length
         const newTransaction = {
            userId: localStorage.getItem("userId"),
            ticketId: localStorage.getItem("nowShowingId"),
            showDate: localStorage.getItem("showDate"),
            startTime: localStorage.getItem("startTime"),
            cinemaName: localStorage.getItem("cinemaName"),
            cinemaUrl: localStorage.getItem("cinemaUrl"),
            howManyTickets: this.state.orderedSeat.length,
            seatPosition: allSeatPosition,
            totalPrice: totalTicketPrice
         }
         axios.post(process.env.REACT_APP_TRANSACTION, newTransaction, { headers: { authorization: 'Bearer ' + localStorage.getItem("jwtToken") } })
         .then((res) => {
            if(res.data.statusCode === 401){
               Swal.fire("Login ulang, yuk?", res.data.errorDetail, "warning")
               .then(() => {
                  window.location = "/login"
                  localStorage.clear()
               })
            }
            else{
               Swal.fire(
                  "Berhasil!",
                  "Pemesanan tiket film '" + this.state.orderedMovie.movieName + "' sudah selesai, silahkan cek Order History untuk keterangan lebih lanjut ~",
                  "success"
               ).then(() => {
                  window.location = "/profile-page/" + localStorage.getItem("userId")
                  localStorage.removeItem("showDate")
                  localStorage.removeItem("startTime")
               })
            }
         })
         .catch((err) => {
            if(err.response.data.statusCode === 401){
               Swal.fire(
                  "Login ulang, yuk?",
                  err.response.data.jwtError,
                  "warning"
               ).then(() => {
                  window.location = "/login"
                  localStorage.clear()
               })
            }
            else{ Swal.fire("Gagal?!", err.response.data.jwtError, "error") }
         })
      }
   }
   render(){
      return(
         <div className="orderPage showInAnimation">
            <Helmet>
               <title>{this.state.orderedMovie.movieName}</title>
            </Helmet>
            <Navbar/>
            <div className="titleAndChangeMovie">
               <p className="mulish noMargin orderMovieTitle">{this.state.orderedMovie.movieName}</p>
               <Link className="mulish changeOrderedMovie" onClick={() => {window.location = "/home-page"}}>Change Movie</Link>
            </div>
            <div className="orderPageRow">
               <div className="chooseYourSeat mulish">
                  <p>Choose Your Seat</p>
                  <div className="insideOrderPage insideChooseYourSeat">
                     <div className="chooseSeatColumn">
                        {this.state.seatAlphabet.map((item) => {
                           const alphabet = item
                           return <div>
                              <div className="chooseSeatRow">
                                 <div className="seatAlphabetGap"><p className="noMargin noLineHeight seatAlphabetPadding">{item}</p></div>
                                 {item === "F" ? 
                                    this.state.seatNumber.map((item) => { 
                                       if(item !== 14) {
                                          if(item === 10) {return <Link class="loveNest noLineHeight chooseSeatBtn" onClick={(e) => {this.checkSeat(e, "Love Nest")}}/>}
                                          else {
                                             if(item === 7) {
                                                return <div>
                                                         <Link className="chooseSeatRow chooseSeatBtn" onClick={(e) => {this.checkSeat(e, alphabet + item)}}/>
                                                         <div className="gapBetweenChooseSeat"/>
                                                      </div>
                                                }
                                             else {return <Link class="noLineHeight chooseSeatBtn" onClick={(e) => {this.checkSeat(e, alphabet + item)}}/>}
                                          }
                                       }
                                    })
                                    :
                                    this.state.seatNumber.map((item) => { 
                                       if(item === 7) {
                                          return <div>
                                                   <Link className="chooseSeatRow chooseSeatBtn" onClick={(e) => {this.checkSeat(e, alphabet + item)}}/>
                                                   <div className="gapBetweenChooseSeat"/>
                                                </div>
                                       }
                                       else {return <Link class="noLineHeight chooseSeatBtn" onClick={(e) => {this.checkSeat(e, alphabet + item)}}/>}
                                       
                                    })
                                 }
                              </div>
                           </div>
                        })}
                        <div className="chooseSeatRow giveGapToNumericAndSeat">
                           <div className="seatAlphabetGap"><p className="noMargin noLineHeight seatAlphabetPadding"></p></div>
                           {this.state.seatNumber.map((item) => {
                              if(item === 7) {
                                 return <div>
                                          <p className="seatNumericInfo">{item}</p>
                                          <div className="gapBetweenChooseSeat"/>
                                       </div>
                              }
                              else {return <p className="seatNumericInfo">{item}</p>}
                              
                           })}
                        </div>
                     </div>
                  </div>
                  <button className="checkoutNowBtn hoverThis" onClick={this.checkoutNow}>Checkout now</button>
               </div>
               <div className="orderInfo mulish">
                  <p>Order Info</p>
                  <div className="insideOrderPage">
                     <div className="insideOrderInfoTop">
                        <div className="insideOrderInfoText"><img className="orderPageCinemaLogo" src={localStorage.getItem("cinemaUrl")}/></div>
                        <p style={{textAlign: 'center', fontSize: '2vw', margin: '1vw'}}>{localStorage.getItem("cinemaName")}</p>
                        <div className="insideOrderInfoText">
                           <p className="noMargin sixBcolor">Movie selected</p>
                           <p className="noMargin">{this.state.orderedMovie.movieName}</p>
                        </div>
                        <div className="insideOrderInfoText">
                           <p className="noMargin sixBcolor">{localStorage.getItem("showDate")}</p>
                           <p className="noMargin">{localStorage.getItem("startTime")}</p>
                        </div>
                        <div className="insideOrderInfoText">
                           <p className="noMargin sixBcolor">One ticket price</p>
                           <p className="noMargin">IDR {this.state.orderedMovie.ticketPrice}</p>
                        </div>
                        <div className="insideOrderInfoText">
                           <p className="noMargin sixBcolor">Seat choosed</p>
                           <p className="noMargin">
                              {this.state.orderedSeat.sort((a,b) => a.localeCompare(b, 'en', { numeric: true })).join(", ")}
                           </p>
                        </div>
                     </div>
                     <div className="insideOrderInfoBottom">
                        <div className="insideOrderInfoText">
                           <p className="noMargin">Total Payment</p>
                           <p className="noMargin">IDR {this.state.orderedMovie.ticketPrice * this.state.orderedSeat.length}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <Footer/>
         </div>
      )
   }
}