# Airtable Timeline Component

-> What I like about the implementation:
I think the logic is solid and that the component matches the desired function.

-> What would I change if I were going to do it again / How you I made my design decisions
Probably be more careful with the design. I've used as inspiration some dribble layouts, like this one: (<https://dribbble.com/shots/25439137-Teamwork-com-Project-Timeline-View>)

About the code, I would separate more the code logic and the helper functions as the date parses and etc.

I think that I've made the features that require less time to do it: Zoom in and out and the possibility to edit the item on the timeline, although it doesn't handle properly short items. If the item is too short, I'll probably implement a modal or a pop up so the user can look at the whole text, but I couldn't do it due the time.

-> How you would test this if you had more time.
I'll probably create some unit test to check if the lanes are separated properly and if all the items are on the screen (dates and content). Also click on the zoom buttons and check if the x scroll appears and the content can be scrolled and still be visible.
