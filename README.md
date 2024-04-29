# README
PSYTRACK CS50 is an application designed for psychotherapists. Through this application, mental health professionals can record and store information about their patients and each of the sessions they conduct, in a manner similar to how they would do so in a clinical record. Psytrack is the name of the overarching project, and within it, currently houses an application called 'psicologo' (psychologist). In the future, I intend to add more applications, for instance, one named 'paciente' (patient), which can be used by the patient. 

The user interface and programming were done in Spanish due to it being my native language and my desire to have the opportunity to discuss it with non-English-speaking colleagues. Except for the login and registration components, the entire application functions as a "Single Page Application - SPA." The backend is managed using Django, and its tasks include receiving requests through API calls and responding by sending data. The frontend was developed using JavaScript, particularly React. Additionally, a React component design library, Ant Design (https://ant.design/docs/react/introduce), was employed for graphical components. 

The application consists of the following modules:
- **Login:** Users can initiate a session and access the application.
- **Signup:** Users can register as professionals within the application.
- **Dashboard (Tablero):** Users can view their username, the number of active patients, the count of registered patients, and the tally of recorded therapy sessions. Additionally, they can see upcoming users they will attend to (sorted from oldest to newest) and recently attended users (sorted from newest to oldest).
- **Search Users (Buscar usuarios):** Users can search for patients they have registered in the application. They can choose from search fields including "any," "name," "last name," and "reason for consultation." Search results are displayed in a table format, presenting information such as names, age, phone number, email, service status, and reason for consultation for each patient. Each name is linked to the respective user's profile.
- **User Profile (Perfil del usuario):** Accessible through the search module or dashboard, the user profile provides general user data, an option to edit certain user details, records within the clinical history that have been created, and a button to return to the search module. Clicking the edit user button opens a side form that submits updates for modified data.
- **Add User (Agregar usuario):** This module displays a form containing sociodemographic and personal data, allowing the creation of a new patient profile on the platform. This empowers professionals to manage their clinical history.
- **Schedule Session (Programar sesión):** This module enables professionals to schedule new sessions in their agenda. A dropdown list, presenting all users registered with an "Active" status, serves as both a search field and a selection mechanism. After choosing a user, the professional can access general client information and a form featuring date and time fields for scheduling the next session.
- **Record Session (Registrar sesión):** Professionals can document the progress of a session they have just conducted, akin to adding a record to a clinical history. This module presents a dropdown list with active users. Once a user is selected, it displays another list containing scheduled sessions in the agenda. Upon selecting a scheduled session, the module provides general session information and a form for documenting its progress.

## Distinctiveness and Complexity:
This application distinguishes itself due to the following reasons:
- It addresses a specific need in the professional field (psychotherapeutic care records) in which I operate. As such, it is not equivalent to any of the previously developed projects.
- The use of Ant Design as a graphical component design library for React sets it apart. This approach differs from the use of Bootstrap throughout the course, requiring review of new documentation and additional programming strategies to ensure proper functioning of each component.
- Forms were not directly rendered through Django for the sake of simplicity. Instead, to render forms using Ant Design's particular logic, it was necessary to send dictionary configuration information via JSON objects through API calls, followed by rendering. This aspect posed one of the more complex challenges in the application's development.
- The application demonstrates mastery in both Multi-Page Application (MPA) and Single Page Application (SPA) concepts. I configured the Login, Logout, and main application as separate apps to achieve this. Furthermore, the main application and all its components operate as an SPA.
- The inclusion of date and time registration introduces programmatic complexities not tackled to the same extent in previous projects.
- A deep dive into proper React usage, component configuration, state specification (particularly useState and useEffect), and the passing of props in the absence of global states via prop drilling was necessary.
- I modified the "User" model provided by Django via BaseUserManager to align the database structure more effectively with the characteristics of the professionals who will use the application.



## How to Run the Application:
To run the application, users simply need visit [this link](https://carloshvelez.pythonanywhere.com/), register and log in. The initial step involves adding users. Once users are added, the application provides access to statistics, user searches, session addition, user editing, and session scheduling, as described in the initial portion of this documentation.

## WARNING: This application was developed solely for learning purposes. Under no circumstances should it be used to record actual patient data, as there is no assurance of compliance with current legal regulations regarding health procedure recording and information security.
