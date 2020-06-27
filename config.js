const config = {
  'site_name': "Censorious",
  'site_url': process.env.HOST_NAME || 'censorious.lathropd.com',
  'db_hostname': process.env.DB_HOST_NAME || 'mysql.' + this.site_url,
  'db_password': process.env.DB_PASSWORD || 'mysql'   

}

module.exports = {config}
