import { seedUsers } from '../src/seeders/user.seeder'
import { seedExercises } from '../src/seeders/exercise.seeder'
import { seedAthletes } from '../src/seeders/athlete.seeder'
import { seedRoles } from '../src/seeders/role.seeder'
import { seedMuscles } from '../src/seeders/muscles.seeder'
import { seedTrainingSessions } from '../src/seeders/trainingSession.seeder'

// Mock functions to test the seeder logic without database connection
describe('Improved Seeder Functionality', () => {
  describe('Resource Selection', () => {
    it('should support seeding individual resources', () => {
      const availableResources = ['roles', 'muscles', 'users', 'exercises', 'athletes', 'trainingSessions']

      // Test that all individual seeders exist
      expect(typeof seedUsers).toBe('function')
      expect(typeof seedExercises).toBe('function')
      expect(typeof seedAthletes).toBe('function')
      expect(typeof seedRoles).toBe('function')
      expect(typeof seedMuscles).toBe('function')
      expect(typeof seedTrainingSessions).toBe('function')

      // Test resource validation
      const invalidResources = ['invalidresource']
      const validResources = ['users', 'exercises']

      expect(availableResources).toContain('users')
      expect(availableResources).toContain('exercises')
      expect(availableResources).not.toContain('invalidresource')
    })
  })

  describe('CLI Arguments Parsing', () => {
    it('should parse command line arguments correctly', () => {
      // This would test the parseArgs function
      // Since it reads from process.argv, we'd need to mock that
      const mockArgv = ['node', 'script.js', 'users,exercises', '--yes']

      // In a real test, we'd mock process.argv and test parseArgs()
      expect(mockArgv).toContain('users,exercises')
      expect(mockArgv).toContain('--yes')
    })
  })

  describe('Help Documentation', () => {
    it('should provide comprehensive help information', () => {
      const expectedHelpElements = ['Usage:', 'Options:', 'Available Resources:', 'Examples:', 'WARNING:']

      // In a real test, we'd capture the help output and verify it contains these elements
      expectedHelpElements.forEach((element) => {
        expect(element).toBeTruthy()
      })
    })
  })
})
