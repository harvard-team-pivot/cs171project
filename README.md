# [Where's my Widget?](http://harvard-team-pivot.github.io/cs171project/)


Final Project collaboration site

This will be the process book location for our project

To begin with we put together the group expectations document.  We discussed needed roles and began creating a project plan.  Based on the roles and processes gleaned from the course, we added tasks to the project plan.  Next we started exploring which data sets we wanted to use.  After setting on the [World Bank](http://lpi.worldbank.org/) logistics data, we worked on which parts of it were most suitable for exploration.

We had decided that slack would be our primary communication method and created a private channel.  A github repository was added to an existing organization.  To separate our data from our presentation we created a second branch for our web site.

## Target

## Design

### Sketches

Following the [five design methodology](fds.design), team members began creating [sketches](link to sketches) for discussion.

Filtering ideas

Map connected to stacked bar chart

Selection or Filtering would highlight country

ranking on bar chart of all countries

Tooltips-lower priority

Slider at bottom

Chloropleth map based on total score of country

Categorize

Questions

What's a given countries ability to trade?  With other countries?  Within region?  What direction is the country moving?

Elevator Pitch created and uploaded.  Video deck was done in powerpoint.  A single visualizations for the deck was created in OmniGraffle
depicting an overview of the steps involved in the logistics process.  Thinking of incorporating it into the final project as it could be
color coded to components.  We'll call it a stretch goal.


Screenflick was available to capture deck presentation with voiceover.  Uploaded it to youtube ->
https://www.youtube.com/watch?v=GTpXQag4Y6M&feature=youtu.be


Project plan iteration two included second generation sketches, interaction options and first draft of page functionality.
A weekly project timeline was also inserted.

Updated process book with todos for Poster Sessions and work breakdown scheduling requirements.

Sketched out poster.  Wireframed poster.  Roughed out poster with a few images.

Presented [initial design](https://github.com/harvard-team-pivot/cs171project/blob/master/layout5thdraft.png) to expert evaluators.  My notes are [here](https://github.com/harvard-team-pivot/cs171project/blob/master/usability%20notes%205th%20draft.rtf).  The tasks and their notes are [here](https://docs.google.com/document/d/1V30sgNuz1gvNCDq5v9yZhS4HqxqGNCIg6ohysef5Xcc/edit).  Will work on refactoring based on their feedback.

Did other teams expert [evaluation](https://docs.google.com/document/d/15eI7KlfR9ygWP7djfWg1bzdEcvD6AFQspwPc3gqs8fw/edit)

## Story

NEEDS Work

### Story Boards

Got the indigo studio tool from infragistics.  Started some storyboards.  Don't really like the tool.

### Interactions

See above

### Innovation

Added the folding feature to the map.  Unfortunately, this broke all the hover's over the countries.  Clicks too.  Looking at workarounds.

# Evaluation

Based on the expert evaluators feedback, we have re-thought our visualization.  All of their suggestions were valuable.  We stack ranked their experts submissions and worked from there.  A lot of their observation reflected an overly complex and cluttered design.  These had been areas where we weren't sure which components should display detail levels.  The expert assessment helped us clarify which dataset were appropiate.  The latest [iteration](https://github.com/harvard-team-pivot/cs171project/blob/master/drafts/layout12thdraft.png) of our design has incorporated most of their suggestions.  The stacked bar chart has not been completely implemented in the sketch.  It will be included in the actual web page.

Team 4 evaluation [link](https://docs.google.com/document/d/1V30sgNuz1gvNCDq5v9yZhS4HqxqGNCIg6ohysef5Xcc/edit)

Write an entry in your process book about the feedback you received in the expert evaluation and how it influences your project re-design.
Project re-design:
Use what you have learned about innovation in lecture to identify a weakness of your current design and propose an innovative solution (1 sketch)
Use the (peer) feedback you have received so far and the knowledge from the poster session to re-design 1-2 existing visualizations in your project


# Implementation:

[Link](http://harvard-team-pivot.github.io/cs171project/)

Dropdowns added for sorting and filtering map and graph indicators.  Added country dropdown too.  Sizing of bootstrap containers to fit visualizations in progress.

Really should have a way to link git commit history into this document.

Starting to link viz's through menuChanged function.  Updated bar color on selection in country dropdown.  Indenting child checkboxes to highlight grouping.

Worked on having filtered dataset show up on radar chart when country is selected.

Adding year dropdown (to be replaced by animation widget) for roughing out updating all visualizations at once.  Adding animate function for map.

Using slider to replace dropdown.  Removed dropdown and added function on _stop_ for slider.

Formatted radio and checkboxes so they're aligned with labels.

Linked selected country to slider and radar simultaneously.  Ideally this should have been done on the map.

## Data

Obtained data from the [World Bank](http://lpi.worldbank.org/) logistics performance index.

### Data cleaning.

Data was exported from excel as csv.  There was one file exported for each year.  Headers were multi-line.  Editing csv to reflect accurate column headers.  Actually saving the data in the right folder, that helps.  Second csv header set updated since data changed from 2007-2010.  The data change was not due to collection of new information, but the addition of summary data.  Saved the other data files to the same location after changing the headers.  Got up too early, typing on a plane to DC (First class baby.)  Found some interesting functionality in WebStorm where uncomment key combination in the middle of a commented block doesn't quite work.  Data is all in JSON using queue, defer and d3.json.

Working with four datasets doesn't make much sense to me.  The 2007 dataset is missing some summary data. I was going to add that, but being the lean developer that I am, I'll ignore it for now.  We'll see whether that decision comes around and bites me in the arse. I'll put the atrributes form all the datasets into one object and add a new attribute for the year.  While reviewing the data in the chrome javascript console, I identified a discrepancy year over year in the number of records.  Seems to be more, or fewer, countries responding to the survey that provides the data.  Not an issue now, but will add a todo for dealing during viz.  Closed excel.

Added them all to a single dataset for the time being.  Pushed to github with the *allData* array available for prototyping.  Need to loop through and add year now.  For single csv it's pretty basic.  Going to create an array of years and loop through all the data, adding year based on filename. Added each dataset to *allData* array.

Added bar chart.  Sorted it by highest score to lowest.  Made it grey per expert evaluation feedback.  Added it to bootstrap container.

Added radar chart from [here](http://bl.ocks.org/nbremer/21746a9668ffdf6d8242).  Tweaking data to work with it.  I got the axes in there own variable.  Able to filter the axes, need to let the function accept scope or rank.

Added choropleth map modeled after [here](https://bl.ocks.org/mbostock/4060606). Added the ability to filter by metric, and set us up for the ability to filter by year (currently set to 2014).

Noticed json for world map codes used numeric country codes, whereas our data contained the ISO-ALPHA-3 code. Did a lookup to convert the alpha code to a numeric code, inserted a column in our data called "ID" to be used for the choropleth map.


# TODO:

TODO - Fill _target_ section ^^^ with youtube deck/video & project submission text

Create your poster and use:
- title and authors
- proper alignment and whitespace (image caption)
- storytelling principles

1) Project-related Poster
- explain your project idea in a
compact way
- explain how the visualizations
would be included in your
vis design
2) Vis Exploration Poster
- give an overview of important
visualizations for your field
- explain each technique

Formalize timeline with feature level milestones

More concise webpage layout/storytelling

Innovation

  Why?
  • increase interestingness
  • make your Vis unique and memorable
  • increase empathy for your topic
  How?
  • Rethink your data
  • Rethink encodings
  • add storytelling elements
  • Do not limit effectiveness.

Data cleanup array

foldable map
color code indicators to match stacked bar char
view controller pub/sub

Need header, rank vs score control and sortable elements added to bar chart

pass value of top score or number of countries for rank to

variablize tool tip

Do parent child selection of indicators

Just do unique values for years.
