export enum ErrorMessage {
  UserNotFound = 'User not found',
  UserAlreadyExists = 'User with same email already exists',
  UnknownUser = 'Unknown user',

  WrongCredentials = 'Wrong credentials',

  TaskNotFound = 'Task not found',

  NotHavePermission = 'You do not have permission to do this action in this resource',

  Unauthorized = 'Unauthorized',
  InvalidInput = 'Has provided invalid inputs',
  NotAuthenticated = 'Is not authenticated or token is invalid',
  TryingToUseResourceFromAnotherUser = 'Is trying to use a resource of another user',
}
