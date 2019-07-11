import React, { Component } from 'react';
import { NormalPeoplePicker } from 'office-ui-fabric-react/lib/Pickers';
import { Persona, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

import GraphSDKHelper from '../../helpers/GraphSdkHelper';
import { connect } from 'react-redux';
import './PeoplePicker.css';

//Mostraba warning en el campo de suggest de usuarios.
import { initializeIcons } from '@uifabric/icons';
initializeIcons(undefined, { disableWarnings: true });

class PeoplePicker extends Component {
  constructor(props) {
    super(props);

    // Set the initial state for the picker data source.
    // The people list is populated in the _onFilterChanged function.
    this._peopleList = null;
    this._searchResults = [];

    // Helper that uses the JavaScript SDK to communicate with Microsoft Graph.
    this.sdkHelper = new GraphSDKHelper(props.user.accessToken);

    this._showError = this._showError;

    this.state = {
      selectedPeople: [],
      isLoadingPeople: true,
      isLoadingPics: true
    };
  }

  // Map user properties to persona properties.
  _mapUsersToPersonas = (users, useMailProp) => {
    return users.map((p) => {

      // The email property is returned differently from the /users and /people endpoints. 
      let email = (useMailProp) ? p.mail : p.emailAddresses[0].address;
      let persona = new Persona();

      persona.primaryText = p.displayName;
      persona.secondaryText = email || p.userPrincipalName;
      persona.presence = PersonaPresence.none; // Presence isn't supported in Microsoft Graph yet
      persona.imageInitials = (!!p.givenName && !!p.surname) ?
        p.givenName.substring(0, 1) + p.surname.substring(0, 1)
        :
        p.displayName.substring(0, 1);
      persona.initialsColor = Math.floor(Math.random() * 15) + 0;
      persona.props = { id: p.id };
      persona.id = p.id;
      persona.department = p.department;

      return persona;
    });
  }

  // Gets the profile photo for each user.
  _getPics = (personas) => {

    // Make suggestions available before retrieving profile pics.
    this.setState({
      isLoadingPeople: false
    });

    this.setState({
      isLoadingPics: false
    });
    //por ahora no recuperaremos la foto del usuario.
    /*
    this.sdkHelper.getProfilePics(personas, (photos) => {
      //photos ya regresa con la Url del blob
      this._peopleList = photos;

      this.setState({
        isLoadingPics: false
      });
    });
    */
  }

  // Build and send the email to the selected people. NO se usa por el momento
  _sendMailToSelectedPeople = () => {
    const recipients = this.state.selectedPeople.map((r) => {
      return {
        EmailAddress: {
          Address: r.secondaryText
        }
      }
    });
    this.sdkHelper.sendMail(recipients, (err, toRecipients) => {
      if (!err) {
        this.setState({
          result: {
            type: MessageBarType.success,
            text: `Mail sent to ${toRecipients.length} recipient(s).`
          }
        });
      }
      else this._showError(err);
    });
  }

  // Handler for when text is entered into the picker control.
  // Populate the people list.
  _onFilterChanged = (filterText, items) => {
    if (this.state.selectedPeople.length === 0) {
      if (this._peopleList) {
        return filterText ? this._peopleList.concat(this._searchResults)
          .filter(item => item.primaryText.toLowerCase().indexOf(filterText.toLowerCase()) === 0)
          .filter(item => !this._listContainsPersona(item, items)) : [];
      }
      else {
        return new Promise((resolve, reject) => this.sdkHelper.getPeople((err, people) => {
          if (!err) {
            this._peopleList = this._mapUsersToPersonas(people, false);
            this._getPics(this._peopleList);
            resolve(this._peopleList);
          }
          else { this._showError(err); }
        }))
          .then(value => value.concat(this._searchResults)
            .filter(item => item.primaryText.toLowerCase().indexOf(filterText.toLowerCase()) === 0)
            .filter(item => !this._listContainsPersona(item, items)))
          .catch(error => {
            console.log("que fallo ", error);
          });
      }
    }
  }

  // Remove currently selected people from the suggestions list.
  _listContainsPersona = (persona, items) => {
    if (!items || !items.length || items.length === 0) {
      return false;
    }
    return items.filter(item => item.primaryText === persona.primaryText).length > 0;
  }

  // Handler for when the Search button is clicked.
  // This sample returns the first 20 matches as suggestions.
  _onGetMoreResults = (searchText) => {
    if (this.state.selectedPeople.length === 0) {
      this.setState({
        isLoadingPeople: true,
        isLoadingPics: true
      });

      return new Promise((resolve) => {
        this.sdkHelper.searchForPeople(searchText.toLowerCase(), (err, people) => {
          if (!err) {
            this._searchResults = this._mapUsersToPersonas(people, true);
            this.setState({
              isLoadingPeople: false
            });
            this._getPics(this._searchResults);
            resolve(this._searchResults);
          }
        });
      });
    }
  }

  // Handler for when the selection changes in the picker control.
  // This sample updates the list of selected people and clears any messages.
  _onSelectionChanged = (items) => {
    this.setState({
      result: null,
      selectedPeople: items
    });

    if (items) {
      //es un callback hacía RequestForm.js
      this.props.setPersona(items);
    }
  }

  // Renders the people picker using the NormalPeoplePicker template.
  render() {
    return (
      <div>
        <Label>
          Si no ves a quien buscas, da clic en <b>Buscar</b>.
        </Label>

        <NormalPeoplePicker
          onResolveSuggestions={this._onFilterChanged}
          pickerSuggestionsProps={{
            suggestionsHeaderText: 'Sugerencias',
            noResultsFoundText: 'Sin resultados',
            searchForMoreText: 'Buscar',
            loadingText: 'Cargando...',
            isLoading: this.state.isLoadingPics
          }}
          inputProps={{ placeholder: '¿Quién solicita? Inicie escribiendo el nombre del usuario' }}
          getTextFromItem={(persona) => persona.primaryText}
          onChange={this._onSelectionChanged}
          onGetMoreResults={this.state.selectedPeople.length === 0?this._onGetMoreResults:null}
          className='ms-PeoplePicker People'
          key='normal-people-picker'
        />

        <br />
        {
          this.state.result &&
          <MessageBar
            messageBarType={this.state.result.type}>
            {this.state.result.text}
          </MessageBar>
        }
      </div>
    );
  }

  // Show the results of the `/me/people` query. NO se usa.
  // For sample purposes only.
  _showPeopleResults = () => {
    let message = 'Query loading. Please try again.';
    if (!this.state.isLoadingPeople) {
      const people = this._peopleList.map((p) => {
        return `\n${p.primaryText}`;
      });
      message = people.toString();
    }
    alert(message)
  }

  // Configure the error message.
  _showError = (err) => {
    this.setState({
      result: {
        type: MessageBarType.error,
        text: `Error ${err.statusCode}: ${err.code} - ${err.message}`
      }
    });
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(PeoplePicker);