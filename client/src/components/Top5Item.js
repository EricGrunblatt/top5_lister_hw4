import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [draggedTo, setDraggedTo] = useState(0);

    function handleDragStart(event, targetId) {
        event.dataTransfer.setData("item", targetId);
    }

    function handleDragOver(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragEnter(event) {
        event.preventDefault();
        console.log("entering");
    }

    function handleDragLeave(event) {
        event.preventDefault();
        console.log("leaving");
        setDraggedTo(false);
    }

    function handleDrop(event, targetId) {
        event.preventDefault();
        let sourceId = event.dataTransfer.getData("item");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        setDraggedTo(false);

        console.log("handleDrop (sourceId, targetId): ( " + sourceId + ", " + targetId + ")");

        // UPDATE THE LIST
        if(sourceId != targetId) {
            store.addMoveItemTransaction(sourceId, targetId);
        }
  
    }

    function handleItemFocus(event) {
        event.target.select();
    }

    function handleToggleItemEdit(event) {
        if(!editActive) {
            event.stopPropagation();
            toggleItemEdit();
        }
    }

    function toggleItemEdit() {
        let newActive = !editActive;
        if(newActive) {
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
    }

    function handleKeyPress(event) {
        if(event.code === "Enter") {
            if(event.target.value === "" || event.target.value === " ") {
                store.addUpdateItemTransaction(index, "?");
            }
            else if(props.text !== event.target.value) {
                store.addUpdateItemTransaction(index, event.target.value);
            }
            store.setIsItemEditInactive();
            toggleItemEdit();
        }
    }

    let { index } = props;
    let itemClass = "top5-item";
    if (draggedTo) {
        itemClass = "top5-item-dragged-to";
    }


    if(editActive) {
        return (
            <TextField
                margin="auto"
                required
                fullWidth
                id={"item-" + (index+1)}
                label={"Item " + (index+1) + " Name"}
                name="name"
                autoComplete={"Item " + (index+1) + " Name"}
                className={itemClass}
                onFocus={handleItemFocus}
                onKeyPress={handleKeyPress}
                defaultValue={props.text}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
        );
    }
    return (
            <ListItem
                id={'item-' + (index+1)}
                key={props.index}
                className={itemClass}
                onDragStart={(event) => {
                    handleDragStart(event, (index+1))
                }}
                onDragOver={(event) => {
                    handleDragOver(event, (index+1))
                }}
                onDragEnter={(event) => {
                    handleDragEnter(event, (index+1))
                }}
                onDragLeave={(event) => {
                    handleDragLeave(event, (index+1))
                }}
                onDrop={(event) => {
                    handleDrop(event, (index+1))
                }}
                draggable="true"
                sx={{ display: 'flex', p: 1 }}
                style={{
                    fontSize: '48pt',
                    width: '100%'
                }}
            >
            <Box sx={{ p: 1 }}>
                <IconButton aria-label='edit' 
                    onClick={(event) => {
                        handleToggleItemEdit(event)
                    }}
                >
                    <EditIcon style={{fontSize:'48pt'}}  />
                </IconButton>
            </Box>
                <Box sx={{ p: 1 }}>{props.text}</Box>
            </ListItem>
    )
}

export default Top5Item;