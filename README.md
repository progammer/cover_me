# cover_me
## Inspiration
_coverme_ was inspired by the difficult economic situation presented by the COVID-19 pandemic. 
As workers who don’t have the option of working remotely are impacted the hardest by the pandemic, we wanted to provide an avenue of stability for said workers while they look for other jobs in the future through a platform that allows them to cover for freelance, often informal jobs.

## What it does
In _coverme_, registered users can post job requests of any type for other registered users to take on. Job requests will have a description of job, any requirements needed, a budget, job location (if any). Workers will be able to search for jobs near them that aligns with their skillset.

## How I built it
We built a web application with a HTML/CSS/JS frontend and Java servlet backend built using Maven and Google Cloud. Some APIs we used were the cloud datastore API to manage postings, Users API for authentication, and Google Maps API to calculate distances and find local postings.

## Challenges I ran into
One thing that we struggled with was the classcastexceptions with datastore because you could put any value (a double, String, etc.) into an Entity. However, this led to an unexpected bug when we were doing our search because our data input format wasn’t compatible with the filter predicates that we were trying to use.

## Accomplishments that I'm proud of
We created a slick and intuitive user interface that used information from google maps, as well as a search engine that allows for job requests to display from greatest to least relevancy.

## What I learned
We learned how to build a web app from the ground up. We discovered how to create interfaces that communicate to the backend, and how to store data on the cloud.

## What's next for _coverme_
In the future, _coverme_ can expand to have worker profiles, and support for more information such as a deadline that the person posting the job wants to post everything by. We can also improve our search speed, and provide more options and filters for finding the best matching jobs.
