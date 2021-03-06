import React, {Component} from 'react';
import Cockpit from '../components/Cockpit';
import List from '../components/List';
import Hint from '../components/Hint';
import classes from './App.module.scss';
import keyGenerator from '../utilities/keyGenerator';

const generateKey = keyGenerator();

class App extends Component {
    state = {
        reverseOrder: false,
        numbering: true,
        items: [
            {
                key: generateKey(),
                text: 'Warm up'
            },
            {
                key: generateKey(),
                text: 'Buy groceries'
            }
        ]
    }

    get options() {
        return [
            {
                purpose: 'Remove all tasks',
                action: this.removeAllItems
            },
            {
                purpose: 'Change order',
                action: this.changeOrder
            },
            {
                purpose: `${this.state.numbering ?
                    `Disable numbering` :
                    `Enable numbering`}`,
                action: this.toggleNumbering
            }
        ]
    }

    get items() {
        /**
         * If tasks should be numbered
         * add index property in each item
         */
        const list = this.state.items
            .map( (item, i) => {
                item.index = this.state.numbering ? 
                    i + 1 :
                    false;
                return item
        });

        // Reverse order if necessary.
        return this.state.reverseOrder ?
            [...list].reverse() :
            list;
    }

    removeAllItems = () => {
        this.setNewItems([]);
    }

    getItemIndex = itemKey =>
        this.state
            .items.findIndex((el) => el.key === itemKey);

    setNewItems = newItemList => {
        this.setState({
            items: newItemList
        });
    }

    addItem = text => {
        /**
         * if list of items exist and
         * last task has been recently created
         * do nothing
         */
        if (this.state.items.length && 
            this.state.items[this.state.items.length - 1]
                .text === '') {
            return;
        }

        this.setState({
            items: [...this.state.items, {
                key: generateKey(),
                text: text,
                isChanging: true
            }]
        })
    }

    removeItem = itemKey => {
        const newItems = [...this.state.items];
        newItems.splice(this.getItemIndex(itemKey), 1)
        
        this.setNewItems(newItems);
    }

    saveChanges = (key, text) => {
        const newItems = [...this.state.items];
        const editedItem = newItems[this.getItemIndex(key)];
        
        editedItem.text = text;
        
        this.setNewItems(newItems);
    }

    changeOrder = () => {
        this.setState({
            reverseOrder: !this.state.reverseOrder
        })
    }

    toggleNumbering = () => {
        this.setState({
            numbering: !this.state.numbering
        })
    }

    render() {
        return (
            <div className={classes['page-wrapper']}>
                <Cockpit
                    addItem={this.addItem}
                    options={this.options}>
                </Cockpit>
                <List
                    items={this.items}
                    removeItem={this.removeItem}
                    saveChanges={this.saveChanges}/>
                <Hint></Hint>
            </div>
        )
    }
}

export default App;