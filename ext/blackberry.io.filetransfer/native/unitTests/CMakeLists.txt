if (CMAKE_COMPILER_IS_GNUCC)
    set(CMAKE_CXX_FLAGS "-Werror -fexceptions -lang-c++ ${CMAKE_CXX_FLAGS}")
    set(CMAKE_C_FLAGS "-Werror ${CMAKE_C_FLAGS}")
endif ()

set(srcs
    test_main.cpp
    ../filetransfer_curl.cpp
    ../../../blackberry.ui.dialog/native/dialog_bps.cpp
    ../../../../dependencies/gtest/src/gmock-gtest-all.cc
)

include_directories(${CMAKE_SOURCE_DIR})
include_directories(${CMAKE_SOURCE_DIR}/../../../dependencies/gtest/src/public/)

add_definitions(-DXP_UNIX)
add_executable(test ${srcs})

target_link_libraries(test m curl bps)
set_target_properties(test PROPERTIES PREFIX "")
