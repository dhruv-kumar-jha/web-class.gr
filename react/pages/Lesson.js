/* The bellow component render each lesson to 
 * container or returns NotFound page.
 */

import React from 'react';
import LessonStore from '../LessonStore';
import lessonValues from '../lessonValues';
import NotFound from '../NotFound';

export default class Lesson extends React.Component {
  constructor() {
    super();
    this.getLesson = this.getLesson.bind(this);
  }

  getLesson() {
    this.setState({
      LessonDetails: LessonStore.getLesson()
    });
    this.renderSuggestedReading(LessonStore.getLesson());
    this.renderDeepening(LessonStore.getLesson());
    this.renderSyllabus(LessonStore.getLesson());
  }

  componentWillMount() {
    LessonStore.setLesson(this.props.params.lessonName);
    LessonStore.on('change', this.getLesson);
    this.getLesson();
  }

  componentWillUnmount() {
    LessonStore.removeListener('change', this.getLesson);
  }

  renderSuggestedReading(lesson) {
    this.suggested_reading = [];
    if (lesson.suggestedReading && lesson.suggestedReading.length > 0) {
      this.suggested_reading.push(<span class="glyphicon glyphicon-book"></span>);
      this.suggested_reading.push(<span>Προτεινόμενη ανάγνωση: </span>);
      for (let link of lesson.suggestedReading) {
        let item = <a href={link.url}>{ ' <' + link.title + '> '}</a>;
        this.suggested_reading.push(item);
      }
    }

  }

  renderDeepening(lesson) {
    this.deepening = [];
    if (lesson.deepening && lesson.deepening.length > 0) {
      this.deepening.push(<span class="glyphicon glyphicon-search"></span>);
      this.deepening.push(<span>Εμβάθυνση: </span>);
      for (let link of lesson.deepening) {
        let item = <a href={link.url}>{ ' <' + link.title + '> '}</a>;
        this.deepening.push(item);
      }
    }

  }

  renderSyllabus(lesson) {
    let syllabus = [];
    this.syllabus_section = null;
    if (lesson.syllabus && lesson.syllabus.length > 0) {
      for (let lesson of lesson.syllabus) {
        let item = <li>{lesson}</li>;
        syllabus.push(item);
      }
      this.syllabus_section = <div> <p>Ύλη που καλύπτεται:</p> 
                              <ul> {syllabus} </ul> </div>;
    }

  }


  render() {
    if (!this.state.LessonDetails) return (<NotFound />);
    return (
      <div>
      <section id="video-section">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item " src={"//www.youtube.com/embed/"+this.state.LessonDetails.videoURL} allowFullScreen></iframe>
        </div>
      </section>
      <section id="lesson-details">
        <header>
          <h1 id="lesson-title">{this.state.LessonDetails.title}</h1></header>
        <div id="lesson-description">
          <p>{this.state.LessonDetails.description}</p>
          {this.syllabus_section}
          <div id="other-informations">
            <p id="presentaion-sheets">
              <span class="glyphicon glyphicon-blackboard"></span>
              <a href={this.state.LessonDetails.presentationSheetURL}>Διαφάνειες μαθήματος </a>
            </p>
            <p id="suggested-reading">
              {this.suggested_reading}
            </p>
            <p id="deepening">
              {this.deepening}
            </p>
          </div>
        </div>
      </section>
      </div>
    )
  }
}
