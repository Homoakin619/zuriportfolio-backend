import express, { Router } from 'express';
import { aboutRouter } from './about.route';
import { awardRouter } from './award.route';
import { certificateRouter } from './certificate.route';
import { contactRouter, socialsRouter } from './contact.route';
import { degreeRouter } from './degree.route';
import { educationRouter } from './education.route';
import { greetingRouter } from './greeting.route';
import { uploadRouter } from './image-upload.route';
import { interestsRouter } from './interests.route';
import { languageRouter, programmingLanguageRouter } from './language.route';
import { profileRouter, usersRouter } from './profile.route';
import { projectsRouter } from './projects.route';
import { referencesRouter } from './reference.route';
import { settingsRouter } from './settings.route';
import { shopRouter } from './shop.route';
import { skillsRouter } from './skills.route';
import { customRouter } from './custom.route';
import { tracksRouter } from './tracks.route';
import { portfolioRouter } from './userportfolio.route';
import { experienceRouter } from './work-experience.route';

const portfoliosRouter = express.Router()

const portfolioRoutes: {
    path: string,
    route: Router
}[] = [
    { path: '/about', route: aboutRouter },
    { path: '/awards', route: awardRouter},
    { path: '/certificates', route: certificateRouter},
    { path: '/contacts', route: contactRouter},
    { path: '/socials', route: socialsRouter},
    { path: '/degree', route: degreeRouter},
    { path: '/education', route: educationRouter},
    { path: '/greeting', route: greetingRouter},
    { path: 'upload', route: uploadRouter},
    { path: '/interests', route: interestsRouter},
    { path: '/languages', route: languageRouter},
    { path: '/programmingLanguage', route: programmingLanguageRouter},
    { path: '/profile', route: profileRouter},
    { path: '/users', route:usersRouter},
    { path: '/projects', route: projectsRouter},
    { path: '/references', route: referencesRouter},
    { path: '/sections', route: shopRouter},
    { path: '/skills', route: skillsRouter},
    { path: '/tracks', route: tracksRouter},
    { path: '', route: settingsRouter},
    { path: '', route: customRouter},
    { path: '', route: portfolioRouter},
    { path: '', route: experienceRouter},
]

portfolioRoutes.forEach((route) => {
    portfoliosRouter.use(route.path, route.route)
});

export default portfoliosRouter