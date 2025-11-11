import { useQuery } from '@tanstack/react-query'
import usersService from '../services/users'

const USERS_QUERY_KEY = ['users']

export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: usersService.getAll,
  })
}

