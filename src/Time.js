import React from 'react';

class Time extends React.Component {
    render() {
        var time = this.props.millisecs;
        var hh = Math.floor(time/(60*60*1000)); time -= hh*(60*60*1000);
        var mm = Math.floor(time/(60*1000)); time -= mm*(60*1000);
        var ss = Math.floor(time/1000);
            
        if (ss<10) ss = "0"+ss;
        if (mm<10) mm = "0"+mm;
        if (hh<10) hh = "0"+hh;
        
        return <div className="info-time">{ hh +":"+ mm +":"+ ss }</div>
    }
}

export default Time;
