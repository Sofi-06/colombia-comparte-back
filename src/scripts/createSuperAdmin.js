const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const createSuperAdmin = async () => {
  try {
    const username = 'superadmin';
    const password = '123456'; // puedes cambiarlo
    const email = 'admin@cms.com';

    console.log('🔎 Verificando si ya existe el usuario...');

    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existingUser) {
      console.log('⚠️ El usuario superadmin ya existe');
      return;
    }

    console.log('🔐 Generando hash de contraseña...');
    const password_hash = bcrypt.hashSync(password, 10);

    console.log('🔎 Buscando rol superadmin...');

    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('nombre', 'superadmin')
      .single();

    if (roleError || !role) {
      throw new Error('❌ No existe el rol superadmin en la base de datos');
    }

    console.log('👤 Creando usuario superadmin...');

    const { error } = await supabase
      .from('usuarios')
      .insert([
        {
          nombre: 'Super',
          apellido: 'Admin',
          email,
          username,
          password_hash,
          rol_id: role.id,
          pais_id: null,
          estado: 'activo',
        },
      ]);

    if (error) {
      throw new Error(error.message);
    }

    console.log('✅ Superadmin creado correctamente');
    console.log('👤 Usuario:', username);
    console.log('🔑 Password:', password);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

createSuperAdmin();