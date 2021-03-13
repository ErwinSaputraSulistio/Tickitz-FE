import React, { Component } from 'react'
import axios from 'axios'
import './style.css'

export default class NowShowing extends Component {
   constructor(){
      super()
      this.state={
         films: []
      }
   }
   componentDidMount(){
      axios.get('http://127.0.0.1:2000/v1/tickets?page=1&limit=6')
      .then((res) => {
         this.setState({ films: res.data.outputData })
      })
      .catch((err) => {alert(err.message)})
   }
   render(){
      return(
         <div className="nowShowing">
            <div className="nowShowingHeader">
               <div class="textSet nowShowingText">Now Showing</div>
               <a href="https://www.instagram.com/alegoplex.es" target="_blank"><div class="textSet viewAll">view all</div></a>
            </div>
            <div className="nowShowingList">
               {this.state.films.map((item) =>
                <div className="nowShowingMovie">
                     <img class="nowShowingMovieImg" src = {"/images/Home/Now Showing/" + item.ticketId + ".jpg"}/>
                     <div className="showWhenHover titleBorder">
                        <div className="textSet nowShowingTitle">{item.movieName}</div>
                        <div className="textSet nowShowingGenre">{item.movieGenre}</div>
                     </div>
                     <div className="showWhenHover btnBorder">
                        <a className="textSet btnDetail" href={"localhost:3000/now-showing/" + item.ticketId} target="_blank">Details</a>
                        <a className="textSet btnBookNow" href="https://www.instagram.com/alegoplex.es" target="_blank">Book Now</a>
                     </div>
                </div>
               )}
            </div>
         </div>
      )
   }
}