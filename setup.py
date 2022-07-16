from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in timeclock/__init__.py
from timeclock import __version__ as version

setup(
	name="timeclock",
	version=version,
	description="ERPNext Timeclock",
	author="Avunu LLC",
	author_email="mail@avu.nu",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
