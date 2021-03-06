
# The webapp server piggy backs on the thick client.
# Set the path to a thick client installation.
THICK_CLIENT_LOCATION = '/opt/Specify'

# Set the database name to the mysql database you
# want to access.
DATABASE_NAME = 'SpecifyDB'

DATABASE_HOST = ''
DATABASE_PORT = ''

# The master user login. Use the same values as
# you did setting up the thick client.
MASTER_NAME = 'MasterUser'
MASTER_PASSWORD = 'MasterPassword'

# Select the schema localization language.
SCHEMA_LANGUAGE = 'en'

# Report runner service
REPORT_RUNNER_HOST = ''
REPORT_RUNNER_PORT = ''

# To allow anonymous use, set ANONYMOUS_USER to a Specify username
# to use for anonymous access.
ANONYMOUS_USER = None

# For exception logging using Sentry (https://github.com/getsentry/sentry).
RAVEN_CONFIG = None

# Support login mechanism.
ALLOW_SUPPORT_LOGIN = False
SUPPORT_LOGIN_TTL = 300

# Usage stats are transmitted to the following address.
# Set to None to disable.
STATS_URL = "https://stats.specifycloud.org/capture"

# Workbench uploader log directory.
# Must exist and be writeable by the web server process.
WB_UPLOAD_LOG_DIR = "/var/cache/specify_wb_upload/"

# Asynchronously generated exports are placed in
# the following directory. This include query result
# exports and Darwin Core archives.
DEPOSITORY_DIR = '/home/specify/specify_depository'

# Old notifications are deleted after this many days.
# If DEPOSITORY_DIR is being cleaned out with a
# scheduled job, this interval should be shorter
# than the clean out time, so that notifications
# are not left that refer to deleted exports.
NOTIFICATION_TTL_DAYS = 7
