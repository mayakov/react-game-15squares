import React, { Component } from 'react';
import Time from './Time';
import './Game.css';

class Info extends React.Component {
    render() {
        return (
            <div className="info-box">
                Steps: {this.props.steps}
                <Time millisecs={this.props.timeLeft}/>
            </div>
        )
    }
}

class Square extends React.Component {
    render() {
        if (!this.props.value) return (
            <div className="square"></div>
        )
        return (
            <div className="square square-digit" onClick={() => this.props.onClick()}>{this.props.value}</div>
        )
    }
}

class Board extends React.Component {
    render() {
        const squares = this.props.squares;
        const board = squares.map((square, i) => 
            <Square key={i.toString()} value={square} onClick={() => this.props.onMove(i)}/>
        );
        return <div className="board"> { board } </div>
    }
}

class Tools extends React.Component {
    render() {
        return (
            <div className="tools">
                <div className="btn btn-blue float-left" onClick={this.props.onStart}>Start new game</div>
                <div className="btn btn-grey float-right" onClick={this.props.onStop}>Stop</div>
            </div>
        )
    }
}

class Game extends Component {
    constructor(props) {
        super(props);
        
        this.orderedSquares = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];
        this.state = {
            squares: this.orderedSquares.slice(),
            isStarted: false,
            steps: 0,
            startTime: 0,
            timeLeft: 0, //in ms
        };
    }
    
    onStart() {
        this.props.hideMessage();
        this.shuffle();
        this.setState({
            isStarted: true,
            steps: 0,
            startTime: (new Date()).getTime(),
            timeLeft: 0
        })
        
        this.timerID = setInterval(
            () => this.timer(),
            1000
        );
        console.log('onStart: timerID', this.timerID);
    }
    
    onStop() {
        this.props.hideMessage();
        this.setState({
            isStarted: false,
            steps: 0,
            squares: this.orderedSquares.slice(),
            timeLeft: 0
        });
        
        console.log('onStop: timerID', this.timerID);
        clearInterval(this.timerID);
    }
    
    onFinish() {
        console.log('onFinish: timerID', this.timerID);
        clearInterval(this.timerID);
        
        this.setState({
            isStarted: false
        });
        
        this.props.showMessage('You won!', {
            closeButton: true,
            timeOut: 180000,
            preventDuplicates:true
        });
    }
    
    timer() {
        var currentTime = (new Date()).getTime(),
            timeDiff = currentTime - this.state.startTime;
            
        this.setState({
            timeLeft: timeDiff
        })
        
        if (timeDiff > 24*60*60*1000) { //24hrs
            this.onStop();
            this.props.showMessage('Session is timed out', {
                closeButton: true,
                timeOut: 180000,
                preventDuplicates:true
            }, 'info');
        }
    }
    
    shuffle() {
        var squares = this.state.squares;
        squares = shuffleFisherYates(squares);
        console.log(squares);
        this.setState({
            squares: squares
        });
        
        function shuffleFisherYates(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }
    }
    
    move(i) {
        if (!this.state.isStarted) {
            this.props.showMessage('Start new game!', {
                closeButton: false,
                timeOut: 1000
            }, 'warning');
            return;
        }
        var arrOfNeighborCellsInd = [i-1, i-4, i+1, i+4];//[<Left index>, <Top index>, <Right index>, <Bottom index>]
        const emptyCellInd = this.state.squares.indexOf(null);
        
        if (i%4 === 0) {
            console.log('крайний левый элемент');
            arrOfNeighborCellsInd[0] = undefined;
        } else if ((i+1)%4 === 0) {
            console.log('крайний правый элемент');
            arrOfNeighborCellsInd[2] = undefined;
        } else {
            console.log('серединный элемент');
        }
        
        var ind = arrOfNeighborCellsInd.indexOf(emptyCellInd);
        if (ind === -1) return;
        
        console.log('move i:', i);
        var squares = this.state.squares.slice();
        squares[emptyCellInd] = this.state.squares[i];
        squares[i] = null;
        
        var steps = this.state.steps;
        steps++;
        
        this.setState({
            squares: squares,
            steps: steps
        })
        
        if (JSON.stringify(squares) === JSON.stringify(this.orderedSquares) && this.state.isStarted) this.onFinish();
    }
    
    render() {
        return (
            <div className="game">
                <Info steps={this.state.steps} timeLeft={this.state.timeLeft}/>
                <Board squares={this.state.squares} onMove={(i) => this.move(i)}/>
                <Tools onStart={() => this.onStart()} onStop={() => this.onStop()}/>
            </div>
        );
    }
}

export default Game;
