ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=pimcalendar
PLUGIN=yes
UTILS=yes

include ../../../../meta.mk

SRCS+=pim_calendar_qt.cpp \
      pim_calendar_js.cpp \
      timezone_utils.cpp \
      service_provider.cpp \
      account_folder_mgr.cpp \
      thread_sync.cpp

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=bbpim QtCore icuuc icudata icui18n
