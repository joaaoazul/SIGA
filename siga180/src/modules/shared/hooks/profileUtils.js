import { supabase } from '../../../services/supabase/supabaseClient';

const TRAINER_FALLBACK_EMAIL = 'joaoazul74@gmail.com';
const isDebug = process.env.NODE_ENV !== 'production';

const profileCache = new Map();

const buildProfilePayload = (profile, user) => {
  let role = profile?.role;

  if (!role && user?.email === TRAINER_FALLBACK_EMAIL) {
    role = 'trainer';
  }

  return {
    role: role || 'athlete',
    name: profile?.name || user?.email || 'Utilizador',
    profile,
  };
};

export const clearProfileCache = (userId) => {
  if (!userId) return;
  profileCache.delete(userId);
};

export const resolveUserWithProfile = async (user, { forceRefresh = false } = {}) => {
  if (!user) {
    return null;
  }

  if (!forceRefresh && profileCache.has(user.id)) {
    const cachedProfile = profileCache.get(user.id);
    return {
      ...user,
      ...cachedProfile,
    };
  }

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id);

    if (error && isDebug) {
      console.error('❌ Error fetching profile:', error);
    }

    const profileData = Array.isArray(profiles) ? profiles[0] : profiles;
    const payload = buildProfilePayload(profileData, user);

    profileCache.set(user.id, payload);

    return {
      ...user,
      ...payload,
    };
  } catch (error) {
    if (isDebug) {
      console.error('❌ Exception resolving user profile:', error);
    }

    const payload = buildProfilePayload(undefined, user);
    profileCache.set(user.id, payload);

    return {
      ...user,
      ...payload,
    };
  }
};

export const updateProfileCache = (userId, profilePayload) => {
  if (!userId) return;

  profileCache.set(userId, {
    ...profileCache.get(userId),
    ...profilePayload,
  });
};
