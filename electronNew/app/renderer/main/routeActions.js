export const commitRoute                 = ({ commitId, projectId }) => `/project/${projectId}/feed?item=${commitId}`
export const contactRoute                = ()                        => `/contact`
export const downloadRoute               = ()                        => `/download`
export const exploreRoute                = ()                        => `/explore`
export const fieldRoute                  = ({ fieldId })             => `/fields/${fieldId}`
export const fileRoute                   = ({ projectId, fileId, revisionId }) => ({ pathname: `/files/${projectId}/${fileId}`, query: { revision: revisionId } })
export const flowRoute                   = ()                        => `/flow`
export const homeRoute                   = ()                        => `/`
export const landingRoute                = ()                        => `/landing`
export const loginRoute                  = ()                        => `/login`
export const onboardingAboutRoute        = ()                        => `/onboarding`
export const onboardingDownloadRoute     = ()                        => `/onboarding/download`
export const onboardingSyncRoute         = ()                        => `/onboarding/sync`
export const openSourceRoute             = ()                        => `/open-source`
export const organisationRoute           = ({ organisationId })      => `/organisaitons/${organisationId}`
export const passwordLostRoute           = ()                        => ({ external: true, pathname: '/password-lost' })
export const pricingRoute                = ()                        => `/pricing`
export const privacyRoute                = ()                        => `/privacy`
export const projectCommitsRoute         = ({ projectId })           => `/project/${projectId}/history`
export const projectFilesRoute           = ({ projectId })           => `/project/${projectId}/files`
export const projectFolderRoute          = ({ projectId, fileId })   => `/project/${projectId}/files/${fileId || ''}`
export const projectRoute                = ({ projectId })           => `/project/${projectId}`
export const projectSettingsRoute        = ({ projectId })           => `/project/${projectId}/settings`
export const projectSettingsTeamRoute    = ({ projectId })           => `/project/${projectId}/settings/team`
export const projectSettingsThreadsRoute = ({ projectId })           => `/project/${projectId}/settings/threads`
export const projectTasksRoute           = ({ projectId })           => `/project/${projectId}/threads`
export const projectTeamRoute            = ({ projectId })           => `/project/${projectId}/team`
export const registerRoute               = ()                        => '/register'
export const securityRoute               = ()                        => `/security`
export const settingsRoute               = ()                        => `/settings`
export const taskEditRoute               = ({ taskId, projectId })   => `/project/${projectId}/threads/${taskId}/edit`
export const taskRoute                   = ({ taskId, projectId })   => `/project/${projectId}/threads/${taskId}`
export const termsRoute                  = ()                        => `/terms`
export const userDetailsRoute            = ({ userId })              => `/users/${userId}/details`
export const userFollowersRoute          = ({ userId })              => `/users/${userId}/followers`
export const userFollowingRoute          = ({ userId })              => `/users/${userId}/following`
export const userProjectsRoute           = ({ userId })              => `/users/${userId}/projects`
export const userRoute                   = ({ userId })              => `/users/${userId}/`
export const userStarsRoute              = ({ userId })              => `/users/${userId}/stars`