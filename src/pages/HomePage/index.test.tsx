import { beforeEach, describe, expect, test, vi } from 'vitest';
import i18next from 'i18next';
import { useAuth } from '@/entities/auth/useAuth';
import { getCurrentUserLikes } from '@/entities/Like/api/getCurrentUserLikes';
import { getGroups } from '@/entities/Group/api/getGroups';
import { getPosts } from '@/entities/Post/api/getPosts';
import { getSuggestedUsers } from '@/entities/User/api/getSuggestedUsers';
import { getUserById } from '@/entities/User/api/getUserById';
import type { GroupModel } from '@/entities/Group/types';
import type { PostsPage } from '@/entities/Post/types';
import type { SuggestedUserModel } from '@/entities/User/types';
import { currentUser, testCurrentPublicUser } from '@/test/userFixtures';
import { testPost } from '@/test/postFixtures';
import { renderWithQueryClient } from '@/test/renderWithQueryClient';
import HomePage from './index';

vi.mock(import('@/entities/auth/useAuth'), () => ({
  useAuth: vi.fn(),
}));

vi.mock(import('@/entities/Like/api/getCurrentUserLikes'), () => ({
  getCurrentUserLikes: vi.fn(),
}));

vi.mock(import('@/entities/Group/api/getGroups'), () => ({
  getGroups: vi.fn(),
}));

vi.mock(import('@/entities/Post/api/getPosts'), () => ({
  getPosts: vi.fn(),
}));

vi.mock(import('@/entities/User/api/getSuggestedUsers'), () => ({
  getSuggestedUsers: vi.fn(),
}));

vi.mock(import('@/entities/User/api/getUserById'), () => ({
  getUserById: vi.fn(),
}));

describe('HomePage', () => {
  const MAX_SUGGESTED_USERS_COUNT = 5;
  const MAX_SUGGESTED_GROUPS_COUNT = 3;

  const quickPostSubmitButtonLabel = i18next.t(($) => $.quickPost.button.default, { ns: 'homePage' });
  const commentInputLabel = i18next.t(($) => $.comment.create.input.comment.label, { ns: 'posts' });
  const suggestedPeopleTitleText = i18next.t(($) => $.suggestions.people.title, { ns: 'homePage' });
  const suggestedGroupsTitleText = i18next.t(($) => $.suggestions.groups.title, { ns: 'homePage' });

  const testSuggestedPeopleNames = Object.freeze(['John', 'Jane', 'Juan', 'Julia', 'Adam', 'Eva']);
  const testSuggestedPeople = testSuggestedPeopleNames.map((name, index) => Object.freeze<SuggestedUserModel>({
    id: index + 10,
    username: `user_${name.toLowerCase()}`,
    firstName: name,
    secondName: null,
    description: null,
    photo: null,
  }));

  const testSuggestedGroupTitles = Object.freeze(['News', 'Shopping', 'DIY', 'Sports']);
  const testSuggestedGroups = testSuggestedGroupTitles.map((title, index) => Object.freeze<GroupModel>({
    id: index + 20,
    title,
    photo: null,
    membersCount: index + 1,
    ownerId: null,
  }));

  const testPostsPage = Object.freeze<PostsPage>({
    items: [testPost],
    total: 1,
    limit: 10,
    offset: 0,
  });

  const testEmptyPostsPage = Object.freeze<PostsPage>({
    items: [],
    total: 0,
    limit: 10,
    offset: 0,
  });

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getCurrentUserLikes).mockResolvedValue([]);
    vi.mocked(getGroups).mockResolvedValue(testSuggestedGroups);
    vi.mocked(getPosts).mockResolvedValue(testEmptyPostsPage);
    vi.mocked(getSuggestedUsers).mockResolvedValue(testSuggestedPeople);
    vi.mocked(getUserById).mockResolvedValue(testCurrentPublicUser);
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser, isUserAuthenticated: true });
  });

  test('renders feed with quick post creation and suggestions for authenticated user', async () => {
    // Arrange
    vi.mocked(getPosts).mockResolvedValue(testPostsPage);
    const screen = await renderWithQueryClient(<HomePage />);
    const quickPostSubmitButton = screen.getByRole('button', { name: quickPostSubmitButtonLabel });
    const postContent = screen.getByText(testPost.content);
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel });
    const suggestedPeopleTitle = screen.getByRole('heading', { name: suggestedPeopleTitleText });
    const suggestedPersonName = screen.getByText(testSuggestedPeopleNames[0]);
    const suggestedGroupsTitle = screen.getByRole('heading', { name: suggestedGroupsTitleText });
    const suggestedGroupName = screen.getByText(testSuggestedGroups[0].title);

    // Assert
    await expect.element(quickPostSubmitButton).toBeVisible();
    await expect.element(postContent).toBeVisible();
    await expect.element(commentInput).toBeVisible();
    await expect.element(suggestedPeopleTitle).toBeVisible();
    await expect.element(suggestedPersonName).toBeVisible();
    await expect.element(suggestedGroupsTitle).toBeVisible();
    await expect.element(suggestedGroupName).toBeVisible();
    expect(getSuggestedUsers).toHaveBeenCalledOnce();
    expect(getGroups).toHaveBeenCalledOnce();
  });

  test('renders feed without quick post creation or suggestions for guests', async () => {
    // Arrange
    vi.mocked(getPosts).mockResolvedValue(testPostsPage);
    vi.mocked(useAuth, { partial: true }).mockReturnValue({ currentUser: null, isUserAuthenticated: false });
    const screen = await renderWithQueryClient(<HomePage />);
    const postContent = screen.getByText(testPost.content);
    const quickPostSubmitButton = screen.getByRole('button', {
      name: quickPostSubmitButtonLabel,
      includeHidden: true,
    });
    const commentInput = screen.getByRole('textbox', { name: commentInputLabel, includeHidden: true });
    const suggestedPeopleTitle = screen.getByRole('heading', { name: suggestedPeopleTitleText, includeHidden: true });
    const suggestedGroupsTitle = screen.getByRole('heading', { name: suggestedGroupsTitleText, includeHidden: true });

    // Assert
    await expect.element(postContent).toBeVisible();
    await expect.element(quickPostSubmitButton).not.toBeInTheDocument();
    await expect.element(commentInput).not.toBeInTheDocument();
    await expect.element(suggestedPeopleTitle).not.toBeInTheDocument();
    await expect.element(suggestedGroupsTitle).not.toBeInTheDocument();
    expect(getSuggestedUsers).not.toHaveBeenCalled();
    expect(getGroups).not.toHaveBeenCalled();
  });

  test('renders 5 suggested people at most', async () => {
    // Arrange
    const screen = await renderWithQueryClient(<HomePage />);
    const overflowedSuggestedPersonName = screen.getByText(testSuggestedPeopleNames[MAX_SUGGESTED_USERS_COUNT]);

    // Assert
    for (let i = 0; i < MAX_SUGGESTED_USERS_COUNT; i++) {
      const suggestedPersonName = screen.getByText(testSuggestedPeopleNames[i]);
      await expect.element(suggestedPersonName).toBeVisible();
    }

    await expect.element(overflowedSuggestedPersonName).not.toBeInTheDocument();
    expect(getSuggestedUsers).toHaveBeenCalledOnce();
  });

  test('renders 3 suggested group cards at most', async () => {
    // Arrange
    const screen = await renderWithQueryClient(<HomePage />);
    const overflowedSuggestedGroup = screen.getByText(testSuggestedGroups[MAX_SUGGESTED_GROUPS_COUNT].title);

    // Assert
    for (let i = 0; i < MAX_SUGGESTED_GROUPS_COUNT; i++) {
      const suggestedGroupTitle = screen.getByText(testSuggestedGroups[i].title);
      await expect.element(suggestedGroupTitle).toBeVisible();
    }

    await expect.element(overflowedSuggestedGroup).not.toBeInTheDocument();
    expect(getGroups).toHaveBeenCalledOnce();
  });

  test('appends person\'s username with \'@\' sign if missing', async () => {
    // Arrange
    const personWithAtSign: SuggestedUserModel = {
      id: 256,
      username: '@monster',
      firstName: 'Mike',
      secondName: 'Wazowski',
      description: null,
      photo: null,
    };
    const personWithoutAtSign = testSuggestedPeople[0];
    vi.mocked(getSuggestedUsers).mockResolvedValue([personWithAtSign, personWithoutAtSign]);
    const screen = await renderWithQueryClient(<HomePage />);
    const personWithAtSignUsername = screen.getByText(new RegExp(personWithAtSign.username));
    const personWithoutAtSignUsername = screen.getByText(new RegExp(personWithoutAtSign.username));

    // Assert
    await expect.element(personWithAtSignUsername).toBeVisible();
    await expect.element(personWithAtSignUsername).toHaveTextContent(personWithAtSign.username);
    await expect.element(personWithoutAtSignUsername).toBeVisible();
    await expect.element(personWithoutAtSignUsername).toHaveTextContent(`@${personWithoutAtSign.username}`);
    expect(getSuggestedUsers).toHaveBeenCalledOnce();
  });

  test('shows suggested people after fulfilling pending loading request', async () => {
    // Arrange
    const suggestedPeopleLoadingMessageText = i18next.t(($) => $.suggestions.people.loading, { ns: 'homePage' });
    let resolveSuggestedUsers!: (users: SuggestedUserModel[]) => void;

    vi.mocked(getSuggestedUsers).mockReturnValue(new Promise<SuggestedUserModel[]>((resolve) => {
      resolveSuggestedUsers = resolve;
    }));

    const screen = await renderWithQueryClient(<HomePage />);
    const suggestedPeopleLoadingMessage = screen.getByText(suggestedPeopleLoadingMessageText);
    const firstSuggestedPersonName = screen.getByText(testSuggestedPeopleNames[0]);

    // Assert
    await expect.element(suggestedPeopleLoadingMessage).toBeVisible();
    await expect.element(firstSuggestedPersonName).not.toBeInTheDocument();

    // Act
    resolveSuggestedUsers(testSuggestedPeople);

    // Assert
    await expect.element(firstSuggestedPersonName).toBeVisible();
    await expect.element(suggestedPeopleLoadingMessage).not.toBeInTheDocument();
    expect(getSuggestedUsers).toHaveBeenCalledOnce();
  });

  test('shows suggested groups after fulfilling pending loading request', async () => {
    // Arrange
    const suggestedGroupsLoadingMessageText = i18next.t(($) => $.suggestions.groups.loading, { ns: 'homePage' });
    let resolveSuggestedGroups!: (groups: GroupModel[]) => void;

    vi.mocked(getGroups).mockReturnValue(new Promise<GroupModel[]>((resolve) => {
      resolveSuggestedGroups = resolve;
    }));

    const screen = await renderWithQueryClient(<HomePage />);
    const suggestedGroupsLoadingMessage = screen.getByText(suggestedGroupsLoadingMessageText);
    const firstSuggestedGroupTitle = screen.getByText(testSuggestedGroups[0].title);

    // Assert
    await expect.element(suggestedGroupsLoadingMessage).toBeVisible();
    await expect.element(firstSuggestedGroupTitle).not.toBeInTheDocument();

    // Act
    resolveSuggestedGroups(testSuggestedGroups);

    // Assert
    await expect.element(firstSuggestedGroupTitle).toBeVisible();
    await expect.element(suggestedGroupsLoadingMessage).not.toBeInTheDocument();
    expect(getGroups).toHaveBeenCalledOnce();
  });

  test('shows error message on failed suggested people loading request', async () => {
    // Arrange
    vi.mocked(getSuggestedUsers).mockRejectedValue(new Error('Network connection lost'));
    const suggestedPeopleErrorMessage = i18next.t(($) => $.suggestions.people.error, { ns: 'homePage' });
    const screen = await renderWithQueryClient(<HomePage />);
    const suggestedPeopleError = screen.getByText(suggestedPeopleErrorMessage);
    const firstSuggestedPersonName = screen.getByText(testSuggestedPeopleNames[0]);

    // Assert
    await expect.element(suggestedPeopleError).toBeVisible();
    await expect.element(firstSuggestedPersonName).not.toBeInTheDocument();
    expect(getSuggestedUsers).toHaveBeenCalledOnce();
  });

  test('shows error message on failed suggested groups loading request', async () => {
    // Arrange
    vi.mocked(getGroups).mockRejectedValue(new Error('Network connection lost'));
    const suggestedGroupsErrorMessage = i18next.t(($) => $.suggestions.groups.error, { ns: 'homePage' });
    const screen = await renderWithQueryClient(<HomePage />);
    const suggestedGroupsError = screen.getByText(suggestedGroupsErrorMessage);
    const firstSuggestedGroupTitle = screen.getByText(testSuggestedGroups[0].title);

    // Assert
    await expect.element(suggestedGroupsError).toBeVisible();
    await expect.element(firstSuggestedGroupTitle).not.toBeInTheDocument();
    expect(getGroups).toHaveBeenCalledOnce();
  });
});
