ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=pimcontacts
PLUGIN=yes
UTILS=yes

include ../../../../meta.mk

SRCS+=pim_contacts_qt.cpp \
      pim_contacts_js.cpp

ifeq ($(UNITTEST),yes)
NAME=test
SRCS+=test_main.cpp
LIBS+=img
USEFILE=
endif

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=bbpim QtCore