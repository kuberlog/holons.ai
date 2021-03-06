import {KeyResult} from "./KeyResult";
import React, {ReactNode} from "react";
import {Dispatch} from 'redux';
import {connect} from "react-redux";
import ObjectiveModel from "../common/Objective"
import {State} from "./State";
import {TextEditable} from "./TextEditable";
import {editObjectiveDescriptionAction, addKeyResultToObjectiveAction} from "./redux/ObjectiveReducer";
import {addKeyResultAction} from "./redux/KeyResultsReducer";
import {KeyResultInMem} from "../common/KeyResult";

interface ObjectiveComponentProps {
  description: string;
  krIds: number[];
  hideKRs?: boolean;
  editDescription: (newDescription: string) => void;
  addKeyResult: () => void;
}
class ObjectiveComponent extends React.Component<ObjectiveComponentProps, {hideKRs: boolean}> {
  constructor(props: ObjectiveComponentProps) {
    super(props);
    this.hideKeyResults = this.hideKeyResults.bind(this);
    this.showKeyResults = this.showKeyResults.bind(this);
    this.addKeyResult = this.addKeyResult.bind(this);
    this.state = {hideKRs: props.hideKRs ? props.hideKRs : false}
  }

  componentCSS = {paddingBottom: '20px'};
  objectiveLabelCSS = {display:'inline'};
  descriptionCSS = {display:'inline'};
  toggleCSS = {display:'inline', position:'relative' as 'relative', left:'3px', top:'5px'};

  addKeyResult(): void {
    this.props.addKeyResult()
  }

  hideKeyResults(): void {
    this.setState({hideKRs: true})
  }

  showKeyResults(): void {
    this.setState({hideKRs: false})
  }

  keyResultComponents(): ReactNode[] {
    return this.props.krIds.map((krId) => <KeyResult id={krId} key={krId}/>);
  };

  renderKeyResultToggle(): ReactNode {
    if(!this.state.hideKRs) {
      return(
          <i className='material-icons hide-key-result-visibility-toggle'
             onClick={this.hideKeyResults}
              style={this.toggleCSS}
          >
            visibility_off
          </i>
      );
    } else {
      return(
          <i className='material-icons show-key-result-visibility-toggle'
             onClick={this.showKeyResults}
             style={this.toggleCSS}
          >
            visibility
          </i>
      );
    }
  }

  renderKeyResultList(): ReactNode {
    if(!this.state.hideKRs) {
      return (
          <div style={{display: 'inline'}}>
            <ul className={'keyResults'}>
              {this.keyResultComponents()}
              <i
                  className="material-icons"
                  style={{position: 'relative', left:'-30px', top:'6px'}}
                  onClick={this.addKeyResult}
              >
                add
              </i>
            </ul>
          </div>
      );
    } else {
      return null;
    }
  }

  render(): ReactNode {
    return (
        <div style={this.componentCSS}>
          <div style={this.objectiveLabelCSS}>Objective:</div>
          <TextEditable
              style={this.descriptionCSS}
              className={'description'}
              onChange={this.props.editDescription}
          >
            {this.props.description}
          </TextEditable>
          <div style={{display: 'block'}}>
            Key Results:
            {this.renderKeyResultToggle()}
            {this.renderKeyResultList()}
          </div>
        </div>
    );
  }
}

interface ObjectiveContainerProps {
  id: number;
}
interface DispatchProps {
  editDescription: (a: string) => void;
  addKeyResult: () => void;
}

class ObjectiveContainerMethods {
  static mapStateToProps = (state: State, ownProps: ObjectiveContainerProps): ObjectiveModel => {
    const objective =  state.Objectives[ownProps.id];
    return Object.assign({}, objective, objective.getKRs());
  };

  static mapDispatchToProps = (dispatch: Dispatch, ownProps: ObjectiveContainerProps): DispatchProps => {
    return {
      editDescription: (newDescription: string) => dispatch(editObjectiveDescriptionAction(ownProps.id, newDescription)),
      addKeyResult: () => {
        const kr = new KeyResultInMem(0,'');
        dispatch(addKeyResultAction(kr));
        dispatch(addKeyResultToObjectiveAction(ownProps.id, kr.toStubbed()));
      }
    };
  };
}

const Objective = connect<ObjectiveModel, DispatchProps, ObjectiveContainerProps, State>(
    ObjectiveContainerMethods.mapStateToProps,
    ObjectiveContainerMethods.mapDispatchToProps
)(ObjectiveComponent);


export {ObjectiveComponent, Objective}

