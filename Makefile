VIRTUAL_ENV ?= /usr

PYTHON = $(VIRTUAL_ENV)/bin/python
PIP = $(VIRTUAL_ENV)/bin/pip

.PHONY: all clean runserver pip_requirements django_migrations frontend python_prep build

all: build django_migrations

build: python_prep frontend

frontend:
	$(MAKE) -C specifyweb/frontend/js_src

python_prep: pip_requirements specifyweb/settings/build_version.py specifyweb/settings/secret_key.py

pip_requirements:
	$(PIP) install --upgrade -r requirements.txt

django_migrations: python_prep
	$(PYTHON) manage.py migrate notifications

specifyweb/settings/build_version.py: .FORCE
	echo "VERSION = '`git describe`'" > $@

specifyweb/settings/secret_key.py:
	echo "# Make this unique, and don't share it with anybody.\n# This value was autogenerated." > $@
	printf "SECRET_KEY = '%b'\n" $$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c 50) >> $@

clean:
	rm -f specifyweb/settings/build_version.py
	rm -f specifyweb/settings/secret_key.py
	$(MAKE) -C specifyweb/frontend/js_src clean

runserver:
	$(PYTHON) specifyweb/manage.py runserver

.FORCE:
