import React from 'react';
import './Playlist.css';
import  TrackList from '../TrackList/TrackList.js';

class Playlist  extends React.Component {
    constructor(props){
        super(props);
        this.handleNameChange= this.handleNameChange.bind(this);
    }
    handleNameChange(e){
        this.props.onNameChange(e.target.value)
    }
    render () { 
        return (
                <div className="Playlist">
                <input defaultValue={'New Playlist'} onChange={this.handleNameChange} />
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
                <button class="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
                 </div>
        )
    } 
}

 export default Playlist;
