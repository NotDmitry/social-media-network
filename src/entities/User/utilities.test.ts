import { describe, expect, test } from 'vitest';
import currentUserImage from '@/assets/images/test_user_walter.jpg';
import defaultUserImage from '@/assets/images/default_user.png';
import otherUserImage from '@/assets/images/test_user_hank.jpg';
import { getProfileImageFallbackUrl, getUserDisplayName, isUserModel, toUserView } from './utilities'
import type { PublicUserModel, User, UserModel } from './types';

describe('getProfileImageFallbackUrl', () => {
  // Arrange
  interface ProfileImageCase {
    testDescription: string;
    isCurrentUser: boolean;
    providedImageUrl?: string | null;
    expected: string;
  }

  const profileImageCases: ProfileImageCase[] = [
    {
      testDescription: 'returns default image for missing image URL (current user)',
      isCurrentUser: true,
      expected: defaultUserImage,
    },
    {
      testDescription: 'returns default image for missing image URL (other user)',
      isCurrentUser: false,
      expected: defaultUserImage,
    },
    {
      testDescription: 'returns default image for empty image URL (current user)',
      isCurrentUser: true,
      providedImageUrl: '',
      expected: defaultUserImage,
    },
    {
      testDescription: 'returns default image for empty image URL (other user)',
      isCurrentUser: false,
      providedImageUrl: '',
      expected: defaultUserImage,
    },
    {
      testDescription: 'returns default image for \'null\' image URL (current user)',
      isCurrentUser: true,
      providedImageUrl: null,
      expected: defaultUserImage,
    },
    {
      testDescription: 'returns default image for \'null\' image URL (other user)',
      isCurrentUser: false,
      providedImageUrl: null,
      expected: defaultUserImage,
    },
    {
      testDescription: 'returns stubbed image for provided URL (current user)',
      isCurrentUser: true,
      providedImageUrl: 'avatar',
      expected: currentUserImage,
    },
    {
      testDescription: 'returns stubbed image for provided URL (other user)',
      isCurrentUser: false,
      providedImageUrl: 'avatar',
      expected: otherUserImage,
    },
  ]

  test.for(profileImageCases)('$testDescription', ({ isCurrentUser, providedImageUrl, expected }) => {
    // Act
    const actualImageUrl = getProfileImageFallbackUrl(isCurrentUser, providedImageUrl);

    // Assert
    expect(actualImageUrl).toBe(expected);
  });
});

describe('getUserDisplayName', () => {
  // Arrange
  interface DisplayNameCase {
    testCondition: string;
    user: User;
    expected: string;
  }

  const displayNameCases: DisplayNameCase[] = [
    {
      testCondition: 'only firstName is present',
      user: {
        username: '@heisenberg',
        firstName: 'Walter',
      },
      expected: 'Walter',
    },
    {
      testCondition: 'only secondName is present',
      user: {
        username: '@heisenberg',
        secondName: 'White',
      },
      expected: 'White',
    },
    {
      testCondition: 'only username is present',
      user: {
        username: '@heisenberg',
      },
      expected: '@heisenberg',
    },
    {
      testCondition: 'both names are present',
      user: {
        username: '@heisenberg',
        firstName: 'Walter',
        secondName: 'White',
      },
      expected: 'Walter White',
    },
    {
      testCondition: 'both names are \'null\'',
      user: {
        username: '@heisenberg',
        firstName: null,
        secondName: null,
      },
      expected: '@heisenberg',
    },
    {
      testCondition: 'firstName is whitespace-only',
      user: {
        username: '@heisenberg',
        firstName: '    ',
        secondName: 'White',
      },
      expected: 'White',
    },
    {
      testCondition: 'both names are whitespace-only',
      user: {
        username: '@heisenberg',
        firstName: '    ',
        secondName: '    ',
      },
      expected: '@heisenberg',
    },
  ]

  test.for(displayNameCases)('returns \'$expected\' when $testCondition', ({ user, expected }) => {
    // Act
    const actualDisplayName = getUserDisplayName(user);

    // Assert
    expect(actualDisplayName).toBe(expected);
  });
});

describe('isUserModel', () => {
  // Arrange
  const testCurrentUser: UserModel = {
    id: 1,
    firstName: 'Jane',
    secondName: 'Doe',
    username: '@jane_doe',
    description: null,
    bio: null,
    creationDate: '2026-10-09T00:00:00.000Z',
    profileImage: null,
    email: 'jane.doe@gmail.com',
    lastLogin: '2026-10-09T00:00:00.000Z',
    modifiedDate: '2026-10-09T00:00:00.000Z',
  };

  const testPublicUser: PublicUserModel = {
    id: 2,
    firstName: 'John',
    secondName: 'Doe',
    username: '@john_doe',
    description: null,
    bio: null,
    creationDate: '2026-10-09T00:00:00.000Z',
    profileImage: null,
  };

  test('accepts current user', () => {
    // Act
    const isValidUserModel = isUserModel(testCurrentUser);

    // Assert
    expect(isValidUserModel).toBe(true);
  });

  test('rejects public user', () => {
    // Act
    const isValidUserModel = isUserModel(testPublicUser);

    // Assert
    expect(isValidUserModel).toBe(false);
  });

  test('rejects current user with field type not corresponding to UserModel', () => {
    // Arrange
    const user = { ...testCurrentUser, id: 'invalid-type-id' };

    // Act
    const isValidUserModel = isUserModel(user);

    // Assert
    expect(isValidUserModel).toBe(false);
  });

  test('rejects primitive value', () => {
    // Arrange
    const user = 128;

    // Act
    const isValidUserModel = isUserModel(user);

    // Assert
    expect(isValidUserModel).toBe(false);
  });

  test('rejects empty object', () => {
    // Arrange
    const user = {};

    // Act
    const isValidUserModel = isUserModel(user);

    // Assert
    expect(isValidUserModel).toBe(false);
  });

  test('accepts current user object with extra fields', () => {
    // Arrange
    const user = { ...testCurrentUser, age: 27 };

    // Act
    const isValidUserModel = isUserModel(user);

    // Assert
    expect(isValidUserModel).toBe(true);
  });
});

describe('toUserView', () => {
  const testCurrentUser: UserModel = {
    id: 1,
    firstName: 'Jane',
    secondName: 'Doe',
    username: '@jane_doe',
    description: null,
    bio: null,
    creationDate: '2026-10-09T00:00:00.000Z',
    profileImage: null,
    email: 'jane.doe@gmail.com',
    lastLogin: '2026-10-09T00:00:00.000Z',
    modifiedDate: '2026-10-09T00:00:00.000Z',
  };

  test('returns user with displayName', () => {
    // Arrange
    const expectedUser = { ...testCurrentUser, displayName: 'Jane Doe' };

    // Act
    const actualUserView = toUserView(testCurrentUser);

    // Assert
    expect(actualUserView).toEqual(expectedUser);
  });

  test('doesn\'t modify the source object', () => {
    // Arrange
    const expectedUser = { ...testCurrentUser };

    // Act
    const actualUserView = toUserView(testCurrentUser);

    // Assert
    expect(actualUserView).not.toBe(testCurrentUser);
    expect(actualUserView).not.toEqual(testCurrentUser);
    expect(testCurrentUser).toEqual(expectedUser);
  });
});
